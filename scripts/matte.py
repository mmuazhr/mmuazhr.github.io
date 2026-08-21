"""Cut Naro and Exa out of duo-v2.png.

Runs standalone: the four derived arrays it needs (bgfit, chres, D, sat) are
built by precompute() on first run and cached in WORK. Delete WORK to force a
rebuild. The cache is gitignored -- D.npy alone is ~16MB.

    python3 scripts/matte.py                     # default params
    python3 scripts/matte.py '{"tag":"try1"}'    # override any of P

The reasoning behind each stage -- the plinth warmth + g/r test, the glass-dome
annulus, the plinth-gated hole filling, and un-premultiplying edge colours
against the fitted background -- is written up in ../character-sheet.md under
"Re-cutting from the source render". Read that first.

Outputs land in WORK as {naro,exa}-{tag}.png at 840px tall. Downscale to the
sizes the site actually uses and re-measure the bottom padding afterwards; the
CSS offsets (--exa-rest, .gm-right translateY) depend on it.

If you re-point SRC at a different render, re-check the fit residual printed by
precompute() before trusting any of the D thresholds in P -- every one of them
is calibrated against this specific background fit.
"""
import numpy as np, sys, json
from pathlib import Path
from PIL import Image
from scipy import ndimage as nd

HERE = Path(__file__).resolve().parent
WORK = HERE / '.matte-cache'
SRC  = HERE.parent.parent / 'content-studio/assets/mascot-concepts/duo-v2.png'
WORK.mkdir(exist_ok=True)

P=dict(split=1020, plinth_y=1340, d_core=60, gr_tan=0.62, gr_grow=0.58,
       ch_dome=15, dome_vmin=90, dome_t0=62, dome_t1=120, dome_max=0.75, erode=3, warm_min=15, grow=4, feather=1.6, tag='v2')
P.update(json.loads(sys.argv[1]) if len(sys.argv)>1 else {})

rgb=np.asarray(Image.open(SRC).convert('RGB')).astype(np.float32)
H,W,_=rgb.shape


def precompute():
    """Fit the cream background, then derive the four arrays everything keys off.

    chres is the one doing the real work: it is a *scale-invariant* residual, so
    the plinth -- which is essentially a darker scaling of the same cream --
    separates from the characters, and the dome interior reads as background
    rather than as subject.
    """
    cream = np.array([245., 225., 209.])
    bg0 = np.abs(rgb - cream).sum(2) < 25
    lbl, _ = nd.label(bg0)
    border = (set(lbl[0,:]) | set(lbl[-1,:]) | set(lbl[:,0]) | set(lbl[:,-1])) - {0}
    bgm = np.isin(lbl, list(border))

    ys, xs = np.nonzero(bgm)
    sel = np.random.RandomState(0).choice(len(xs), min(200000, len(xs)), replace=False)
    # Normalise to 0..1 purely for lstsq conditioning. Raw pixel coords are
    # perfectly safe in float64 -- this is NOT about overflow, and it is not
    # what silences the warnings below. Don't go chasing a numerical problem
    # here; there isn't one.
    xn, yn = xs/(W-1.0), ys/(H-1.0)
    A = np.stack([np.ones_like(xn), xn, yn, xn*xn, yn*yn, xn*yn], 1)
    coef = [np.linalg.lstsq(A[sel], rgb[ys[sel], xs[sel], c].astype(np.float64), rcond=None)[0]
            for c in range(3)]
    Y, X = np.mgrid[0:H, 0:W].astype(np.float64)
    X /= (W-1.0); Y /= (H-1.0)
    B = np.stack([np.ones_like(X), X, Y, X*X, Y*Y, X*Y], 2)
    # einsum rather than `B @ c`: the BLAS path for a (H,W,6)@(6,) contraction
    # emits spurious overflow/invalid warnings even though the result is finite
    # and correct -- an Accelerate artifact on macOS, so you may not see them on
    # other platforms. einsum sidesteps BLAS entirely. Output verified identical
    # both ways (bit-for-bit against the shipped cutouts).
    bgfit = np.stack([np.einsum('ijk,k->ij', B, c) for c in coef], 2).astype(np.float32)

    D = np.abs(rgb - bgfit).sum(2)
    s = (rgb*bgfit).sum(2) / (bgfit*bgfit).sum(2)
    chres = np.sqrt(((rgb - s[...,None]*bgfit)**2).sum(2)).astype(np.float32)
    mx, mn = rgb.max(2), rgb.min(2)
    sat = ((mx - mn) / np.maximum(mx, 1)).astype(np.float32)

    res = D[bgm]
    print(f'background fit residual over {bgm.sum()} px: mean {res.mean():.1f}, p99 {np.percentile(res,99):.1f} (sum-abs)')
    for name, arr in (('bgfit',bgfit), ('chres',chres), ('D',D.astype(np.float32)), ('sat',sat)):
        np.save(WORK/f'{name}.npy', arr)
    return bgfit, chres, D.astype(np.float32), sat


if all((WORK/f'{n}.npy').exists() for n in ('bgfit','chres','D','sat')):
    bgfit=np.load(WORK/'bgfit.npy'); chres=np.load(WORK/'chres.npy')
    D=np.load(WORK/'D.npy'); sat=np.load(WORK/'sat.npy')
else:
    bgfit, chres, D, sat = precompute()

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

Image.fromarray((alpha*255).astype(np.uint8)).resize((768,768)).save(WORK/f'alpha-{P["tag"]}.png')

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
    im.save(WORK/f'{name}-{P["tag"]}.png',optimize=True)
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
