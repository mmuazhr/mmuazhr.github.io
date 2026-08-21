"""Cut Naro and Exa out of duo-v2.png.

INCOMPLETE ON ITS OWN. This expects four precomputed arrays in WORK/:

    bgfit.npy   per-channel quadratic fit of the cream background, taken over
                the flood-filled border region
    chres.npy   chroma residual against that fit
    D.npy       per-pixel sum-abs deviation from the fit  (~16MB, not in git)
    sat.npy     saturation

They are derived from SRC and were not committed because of D.npy's size. If
they are missing, rebuild them from the source image before running this.

The reasoning behind each stage — the plinth warmth + g/r test, the glass-dome
annulus, the plinth-gated hole filling, and un-premultiplying edge colours
against the fitted background — is written up in ../character-sheet.md under
"Re-cutting from the source render". Read that first.

Outputs land in WORK/ as {naro,exa}-{tag}.png at 840px tall. Downscale to the
sizes the site actually uses and re-measure the bottom padding afterwards; the
CSS offsets (--exa-rest, .gm-right translateY) depend on it.
"""
import numpy as np, sys, json
from PIL import Image
from scipy import ndimage as nd

WORK='/private/tmp/claude-501/-Users-muazhusaini-Documents-Project/df432e8e-505c-4d5f-af12-d18ff7d2af33/scratchpad/matte/'
SRC='/Users/muazhusaini/Documents/Project/content-studio/assets/mascot-concepts/duo-v2.png'
P=dict(split=1020, plinth_y=1340, d_core=60, gr_tan=0.62, gr_grow=0.58,
       ch_dome=15, dome_vmin=90, dome_t0=62, dome_t1=120, dome_max=0.75, erode=3, warm_min=15, grow=4, feather=1.6, tag='v2')
P.update(json.loads(sys.argv[1]) if len(sys.argv)>1 else {})

rgb=np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32)
bgfit=np.load(WORK+'bgfit.npy'); chres=np.load(WORK+'chres.npy')
D=np.load(WORK+'D.npy'); sat=np.load(WORK+'sat.npy')
H,W,_=rgb.shape
rows=np.arange(H)[:,None]; cols=np.arange(W)[None,:]

core=nd.binary_closing(D>P['d_core'], np.ones((3,3)))

# --- plinth: below its top edge, only saturated (character) pixels survive ---
# Below the plinth's top edge the only real content is boots. Tan (incl. its
# coral-bounce contact shadow) sits at g/r 0.70-0.90; coral boots stay under
# 0.59 and Naro's blue/green never passes the warm test at all.
warm=(rgb[:,:,0]-rgb[:,:,2])>P['warm_min']
gr=rgb[:,:,1]/np.maximum(rgb[:,:,0],1)
plinth=(rows>=P['plinth_y'])&core&warm&(gr>P['gr_tan'])
plinth=(nd.binary_dilation(plinth,np.ones((3,3)),iterations=P['grow'])
        &warm&(gr>P['gr_grow'])&(rows>=P['plinth_y']))

# --- dome: low-chroma blob at Naro's head, closed into its convex disc ------
ll,_=nd.label((D>22)&(chres<13))
blob=nd.binary_fill_holes(nd.binary_closing(ll==ll[300,700], np.ones((9,9))))
def spanfill(m):
    out=np.zeros_like(m); idx=np.arange(m.shape[1])[None,:]
    any_=m.any(1)
    lo=np.where(any_, m.argmax(1), 0); hi=np.where(any_, m.shape[1]-1-m[:,::-1].argmax(1), -1)
    out=(idx>=lo[:,None])&(idx<=hi[:,None])&any_[:,None]
    return out
disc=spanfill(blob)&spanfill(blob.T).T
# glass = low chroma AND not dark (keeps the black eyes/mouth inside the dome)
dome=disc&(chres<P['ch_dome'])&(rgb.min(2)>P['dome_vmin'])

subj=core&~plinth&~dome
subj=nd.binary_opening(subj,np.ones((3,3)))
sl,sn=nd.label(subj); sizes=nd.sum(subj,sl,range(1,sn+1))
subj=np.isin(sl,[i+1 for i,s in enumerate(sizes) if s>4000])
# fill an interior hole only if it is not made of plinth/dome (background) pixels
holes=nd.binary_fill_holes(subj)&~subj
hl,hn=nd.label(holes)
bad=plinth.astype(np.float32)   # dome-shaped holes inside the head must still be filled
hs=nd.sum(holes,hl,range(1,hn+1)); hb=nd.mean(bad,hl,range(1,hn+1))
subj=subj|np.isin(hl,[i+1 for i in range(hn) if hs[i]<40000 and hb[i]<0.25])
# drop isolated specks
sl2,sn2=nd.label(subj); z=nd.sum(subj,sl2,range(1,sn2+1))
subj=np.isin(sl2,[i+1 for i,v in enumerate(z) if v>4000])

hard=nd.gaussian_filter(nd.binary_erosion(subj,np.ones((3,3)),iterations=P['erode']).astype(np.float32),P['feather'])
dome_a=nd.gaussian_filter(np.where(dome,np.clip((D-P['dome_t0'])/(P['dome_t1']-P['dome_t0']),0,1)*P['dome_max'],0).astype(np.float32),1.2)
alpha=np.maximum(hard,dome_a)

a3=alpha[...,None]
col=np.clip(np.where(a3>0.15,(rgb-(1-a3)*bgfit)/np.maximum(a3,1e-3),rgb),0,255)

Image.fromarray((alpha*255).astype(np.uint8)).resize((768,768)).save(WORK+f'alpha-{P["tag"]}.png')

def emit(al,name):
    al=al.astype(np.float32)
    ys,xs=np.nonzero(al>0.02); y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    c=col[y0:y1,x0:x1]; a=al[y0:y1,x0:x1]; h,w=a.shape
    # 4% margin measured against the PADDED canvas, so it is also >4% of the
    # cropped content -- satisfies either reading of the spec.
    p=int(round(0.04*max(h,w)/0.92))
    C=np.zeros((h+2*p,w+2*p,4),np.float32); C[p:p+h,p:p+w,:3]=c; C[p:p+h,p:p+w,3]=a*255
    im=Image.fromarray(C.astype(np.uint8))
    im=im.resize((max(1,round(im.width*840/im.height)),840), Image.LANCZOS)
    im.save(WORK+f'{name}-{P["tag"]}.png',optimize=True)
    print(name,'src box y%d-%d x%d-%d pad %d ->'%(y0,y1,x0,x1,p),im.size)

def biggest(m):
    l,n=nd.label(m)
    if n==0: return m
    z=nd.sum(m,l,range(1,n+1))
    return l==int(np.argmax(z))+1
naro_body=biggest(subj&(cols<P['split']))
exa_body =biggest(subj&(cols>=P['split']))
naro_a=np.maximum(np.where(naro_body,hard,0), dome_a)
exa_a =np.where(exa_body,hard,0)
emit(naro_a,'naro'); emit(exa_a,'exa')
