import { useEffect, useState } from 'react'

const BIG = 'ST.JOHNS'.split('')

export const Intro = () => {
  const [video, setVideo] = useState(true)

  useEffect(() => {
    const id = setTimeout(() => {
      window.history.pushState({}, '', '/home')
      window.dispatchEvent(new Event('popstate'))
    }, 6500)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="ix">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@500;600;800&display=swap');
        .ix{position:fixed;inset:0;background:#000;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-family:'Work Sans',system-ui,sans-serif;text-transform:uppercase;color:#fff;user-select:none;-webkit-user-select:none;animation:ix-out .9s ease 5.6s forwards}
        .ix-vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .ix-shade{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,.6) 0%,rgba(0,0,0,.15) 75%)}
        .ix-in{position:relative;display:flex;flex-direction:column;align-items:center;max-width:100%}
        .ix-eyebrow{margin:0;color:#FF8A1F;font-weight:600;font-size:clamp(.65rem,2.2vw,1rem);letter-spacing:.7em;margin-right:-.7em;opacity:0;animation:ix-eye 1.6s ease 1.1s forwards}
        .ix-line{height:1px;width:0;background:#FF8A1F;margin:22px 0 10px;animation:ix-draw 1s ease 1.7s forwards}
        .ix-big{margin:0;font-weight:800;font-size:clamp(2.8rem,13.5vw,9rem);line-height:1;letter-spacing:.06em;margin-right:-.06em;display:flex;white-space:nowrap}
        .ix-m{display:inline-block;overflow:hidden;padding:.04em .01em}
        .ix-m span{display:inline-block;transform:translateY(110%);animation:ix-rise .9s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(2s + var(--i)*.12s)}
        .ix-bar{height:4px;width:0;background:#8B5523;margin-top:4px;animation:ix-bar 1s ease 3.1s forwards}
        .ix-sub{margin:22px -.5em 0 0;color:#FF8A1F;font-weight:600;font-size:clamp(.9rem,3.4vw,1.8rem);letter-spacing:.5em;opacity:0;animation:ix-fade .9s ease 3.3s forwards}
        .ix-school{margin:22px 0 0;max-width:92vw;font-weight:500;font-size:clamp(.68rem,2.2vw,1rem);letter-spacing:.2em;line-height:1.8;color:#e8e8e8;opacity:0;animation:ix-fade .9s ease 3.8s forwards}
        .ix-loc{margin:0;max-width:92vw;font-weight:500;font-size:clamp(.62rem,2vw,.85rem);letter-spacing:.22em;line-height:1.8;color:#a9a9a9;opacity:0;animation:ix-fade .9s ease 4.2s forwards}
        @keyframes ix-eye{0%{opacity:0;letter-spacing:1.1em}100%{opacity:1;letter-spacing:.7em}}
        @keyframes ix-draw{to{width:min(240px,50vw)}}
        @keyframes ix-bar{to{width:min(240px,50vw)}}
        @keyframes ix-rise{to{transform:none}}
        @keyframes ix-fade{to{opacity:1}}
        @keyframes ix-out{to{opacity:0}}
      `}</style>

      {video && (
        <video className="ix-vid" src="/intro.mp4" autoPlay muted playsInline onError={() => setVideo(false)} />
      )}
      <div className="ix-shade" />

      <div className="ix-in">
        <p className="ix-eyebrow">THE AUCTION EXPERIENCE &middot; 2026</p>
        <div className="ix-line" />
        <h1 className="ix-big" aria-label="St.Johns">
          {BIG.map((c, i) => (
            <span className="ix-m" key={i}><span style={{ '--i': i }}>{c}</span></span>
          ))}
        </h1>
        <div className="ix-bar" />
        <p className="ix-sub">PLAYER AUCTION</p>
        <p className="ix-school">MADE WITH LOVE FOR<br />ST. JOHN'S ENGLISH MEDIUM HIGH SCHOOL</p>
        <p className="ix-loc">SUBEDARPET, NELLORE, ANDHRA PRADESH &mdash; 524001</p>
      </div>
    </div>
  )
}
