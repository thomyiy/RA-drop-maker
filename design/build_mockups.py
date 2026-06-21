#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Jewel Memories — Dossier de maquettes du site.
Direction artistique : moderne, photo-driven, premium minimal (réf. thelma.pet).
Sans-serif gras, blanc + charcoal + tons terreux feutrés, coins nets,
étapes numérotées, avant/après, badges de confiance.
Génère un PDF vectoriel, une page par écran du site.
"""
import os, math
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FONTS = "/mnt/skills/examples/canvas-design/canvas-fonts"
def reg(name, fn): pdfmetrics.registerFont(TTFont(name, os.path.join(FONTS, fn)))
reg("Disp",  "BricolageGrotesque-Bold.ttf")      # titres gras
reg("DispR", "BricolageGrotesque-Regular.ttf")   # titres légers
reg("Sans",  "Outfit-Regular.ttf")               # texte courant / UI
reg("SansB", "Outfit-Bold.ttf")                  # accents / prix

# ---- Palette : blanc + charcoal + terreux feutré ----
WHITE   = HexColor("#FFFFFF")
PAPER   = HexColor("#F6F3ED")   # blanc cassé (sections)
INK     = HexColor("#1A1714")   # charcoal (titres)
INK2    = HexColor("#46413A")   # texte courant
MUTE    = HexColor("#928A7D")   # libellés gris / étapes
SAND    = HexColor("#E9E2D5")   # blocs image
SAND2   = HexColor("#E0D7C7")
PHOTO   = HexColor("#CDC2AF")   # silhouette photo
LINE    = HexColor("#E5DFD3")
LINE_DK = HexColor("#D6CCBA")
CLAY    = HexColor("#B07C5B")   # accent terreux (rare)
CLAY_DK = HexColor("#8F6244")

W = 1280
RC = 4    # rayon cartes (coins quasi nets)

class P:
    def __init__(self): self.ops = []
    def rect(self, x, y, w, h, fill=None, stroke=None, sw=1, radius=0):
        def fn(c):
            if fill: c.setFillColor(fill)
            if stroke: c.setStrokeColor(stroke); c.setLineWidth(sw)
            f = 1 if fill else 0; s = 1 if stroke else 0
            if radius > 0: c.roundRect(x, y, w, h, radius, stroke=s, fill=f)
            else: c.rect(x, y, w, h, stroke=s, fill=f)
        self.ops.append(fn)
    def line(self, x1, y1, x2, y2, color, w=1):
        def fn(c):
            c.setStrokeColor(color); c.setLineWidth(w); c.line(x1, y1, x2, y2)
        self.ops.append(fn)
    def ellipse(self, x1, y1, x2, y2, fill=None, stroke=None, sw=1):
        def fn(c):
            if fill: c.setFillColor(fill)
            if stroke: c.setStrokeColor(stroke); c.setLineWidth(sw)
            c.ellipse(x1, y1, x2, y2, stroke=1 if stroke else 0, fill=1 if fill else 0)
        self.ops.append(fn)
    def circle(self, cx, cy, r, fill=None, stroke=None, sw=1):
        self.ellipse(cx-r, cy-r, cx+r, cy+r, fill, stroke, sw)
    def path(self, fn): self.ops.append(fn)
    def text(self, x, y, s, font, size, color, align='l', tracking=0):
        def fn(c):
            c.saveState(); c.translate(x, y); c.scale(1, -1)
            to = c.beginText(); to.setFont(font, size); to.setFillColor(color)
            if tracking: to.setCharSpace(tracking)
            tw = pdfmetrics.stringWidth(s, font, size) + tracking*max(len(s)-1, 0)
            ox = 0 if align == 'l' else (-tw if align == 'r' else -tw/2)
            to.setTextOrigin(ox, 0); to.textLine(s); c.drawText(to)
            c.restoreState()
        self.ops.append(fn)

def text_w(s, font, size, tracking=0):
    return pdfmetrics.stringWidth(s, font, size) + tracking*max(len(s)-1, 0)

def wrap(s, font, size, maxw):
    words = s.split(); lines, cur = [], ""
    for w_ in words:
        t = (cur + " " + w_).strip()
        if text_w(t, font, size) <= maxw: cur = t
        else:
            if cur: lines.append(cur)
            cur = w_
    if cur: lines.append(cur)
    return lines

def paragraph(p, x, y, s, font, size, color, maxw, leading, align='l'):
    for ln in wrap(s, font, size, maxw):
        p.text(x + (maxw/2 if align == 'c' else 0), y, ln, font, size, color,
               align=('c' if align == 'c' else 'l'))
        y += leading
    return y

# ---------- composants ----------
def kicker(p, x, y, s, align='l', color=MUTE):
    p.text(x, y, s.upper(), "SansB", 9.5, color, align=align, tracking=2.2)

def btn(p, x, y, w, h, label, kind="primary"):
    if kind == "primary":
        p.rect(x, y, w, h, fill=INK, radius=6); col = WHITE
    elif kind == "accent":
        p.rect(x, y, w, h, fill=CLAY, radius=6); col = WHITE
    else:
        p.rect(x, y, w, h, fill=WHITE, stroke=INK, sw=1.3, radius=6); col = INK
    p.text(x+w/2, y+h/2+4, label, "SansB", 12.5, col, align='c', tracking=0.4)

def badge(p, x, y, label):
    w = text_w(label, "Sans", 10.5) + 40
    h = 30
    p.rect(x, y, w, h, fill=WHITE, stroke=LINE_DK, sw=1, radius=h/2)
    p.circle(x+16, y+h/2, 3, fill=CLAY)
    p.text(x+27, y+h/2+3.5, label, "Sans", 10.5, INK2)
    return w

def star(p, cx, cy, r, color):
    pts = []
    for i in range(10):
        ang = -math.pi/2 + i*math.pi/5
        rr = r if i % 2 == 0 else r*0.42
        pts.append((cx+rr*math.cos(ang), cy+rr*math.sin(ang)))
    def fn(c):
        c.setFillColor(color); pa = c.beginPath(); pa.moveTo(*pts[0])
        for q in pts[1:]: pa.lineTo(*q)
        pa.close(); c.drawPath(pa, fill=1, stroke=0)
    p.ops.append(fn)
def stars(p, x, y, n, r, color, gap=5):
    for i in range(n): star(p, x+r+i*(2*r+gap), y, r, color)

def portrait(p, cx, cy, s, tone=PHOTO):
    """Silhouette photo (tête + épaules)."""
    p.circle(cx, cy - s*0.20, s*0.23, fill=tone)
    def fn(c):
        c.setFillColor(tone); pa = c.beginPath()
        pa.moveTo(cx - s*0.46, cy + s*0.52)
        pa.lineTo(cx - s*0.36, cy + s*0.14)
        pa.curveTo(cx - s*0.30, cy - s*0.04, cx - s*0.16, cy + s*0.05, cx, cy + s*0.05)
        pa.curveTo(cx + s*0.16, cy + s*0.05, cx + s*0.30, cy - s*0.04, cx + s*0.36, cy + s*0.14)
        pa.lineTo(cx + s*0.46, cy + s*0.52); pa.close()
        c.drawPath(pa, fill=1, stroke=0)
    p.ops.append(fn)

def pendant_art(p, cx, cy, s, kind="round", initial=None, stroke=INK):
    """Pendentif gravé en line-art (charcoal)."""
    p.circle(cx, cy - s*0.6, 4, stroke=stroke, sw=1.3)  # bélière
    if kind == "round":
        p.circle(cx, cy, s*0.5, fill=WHITE, stroke=stroke, sw=1.6)
        p.circle(cx, cy, s*0.5-6, stroke=LINE_DK, sw=0.7)
    elif kind == "rect":
        w_, h_ = s*0.74, s*1.02
        p.rect(cx-w_/2, cy-h_/2, w_, h_, fill=WHITE, stroke=stroke, sw=1.6, radius=6)
        p.rect(cx-w_/2+6, cy-h_/2+6, w_-12, h_-12, stroke=LINE_DK, sw=0.7, radius=3)
    elif kind == "heart":
        r = s*0.27
        p.circle(cx-r*0.92, cy-r*0.5, r, fill=WHITE, stroke=stroke, sw=1.6)
        p.circle(cx+r*0.92, cy-r*0.5, r, fill=WHITE, stroke=stroke, sw=1.6)
        def fn(c):
            c.setFillColor(WHITE); c.setStrokeColor(stroke); c.setLineWidth(1.6)
            pa = c.beginPath(); pa.moveTo(cx-r*1.84, cy-r*0.5)
            pa.lineTo(cx, cy+r*1.5); pa.lineTo(cx+r*1.84, cy-r*0.5)
            c.drawPath(pa, stroke=1, fill=1)
        p.ops.append(fn)
        p.line(cx-r*1.84, cy-r*0.5, cx+r*1.84, cy-r*0.5, WHITE, 3)
    elif kind == "oval":
        w_, h_ = s*0.62, s*0.9
        p.ellipse(cx-w_/2, cy-h_/2, cx+w_/2, cy+h_/2, fill=WHITE, stroke=stroke, sw=1.6)
        p.ellipse(cx-w_/2+6, cy-h_/2+6, cx+w_/2-6, cy+h_/2-6, stroke=LINE_DK, sw=0.7)
    if initial:
        p.text(cx, cy + s*0.16, initial, "Disp", s*0.42, INK, align='c')

def image_panel(p, x, y, w, h, fill=SAND):
    p.rect(x, y, w, h, fill=fill, radius=2)

def before_after(p, x, y, w, h):
    image_panel(p, x, y, w, h)
    half = w/2
    cell = min(half, h)
    s = cell*0.5
    p.line(x+half, y+24, x+half, y+h-24, LINE_DK, 1)
    portrait(p, x+half*0.5, y+h*0.42, s)
    kicker(p, x+half*0.5, y+h-26, "Votre photo", align='c')
    pendant_art(p, x+half+half*0.5, y+h*0.40, s, "round", "M")
    kicker(p, x+half+half*0.5, y+h-26, "Gravé à la main", align='c')
    p.circle(x+half, y+h/2, 19, fill=INK)
    p.text(x+half, y+h/2+5, "→", "Sans", 16, WHITE, align='c')

# ---------- chrome site ----------
NAV = ["Modèles", "Comment ça marche", "Qualité", "FAQ"]
def logo(p, x, cy, color=INK, gold=CLAY):
    p.circle(x, cy, 9, stroke=gold, sw=1.6)
    p.text(x, cy+3.5, "J", "Disp", 11, color, align='c')
    p.text(x+22, cy+5, "Jewel Memories", "Disp", 18, color)

def browser_top(p, top, url):
    bh = 38
    p.rect(0, top, W, bh, fill=PAPER)
    for i, col in enumerate([HexColor("#D9836B"), HexColor("#E0B25C"), HexColor("#9FB37E")]):
        p.circle(26+i*18, top+bh/2, 5, fill=col)
    p.rect(86, top+8, W-86-30, bh-16, fill=WHITE, radius=4)
    p.text(104, top+bh/2+3.5, url, "Sans", 10.5, MUTE)
    return top+bh

def site_header(p, top):
    hh = 66
    p.rect(0, top, W, hh, fill=WHITE)
    p.line(0, top+hh, W, top+hh, LINE, 1)
    logo(p, 58, top+hh/2)
    nx = 470
    for item in NAV:
        p.text(nx, top+hh/2+4.5, item, "Sans", 12.5, INK2)
        nx += text_w(item, "Sans", 12.5) + 38
    btn(p, W-58-170, top+hh/2-18, 170, 36, "Créer mon pendentif", "primary")
    return top+hh

def site_footer(p, top):
    fh = 196
    p.rect(0, top, W, fh, fill=INK)
    x = 58
    p.circle(x, top+48, 9, stroke=CLAY, sw=1.6)
    p.text(x, top+51.5, "J", "Disp", 11, WHITE, align='c')
    p.text(x+22, top+53, "Jewel Memories", "Disp", 18, WHITE)
    p.text(x, top+84, "Vos souvenirs, gravés pour toujours.", "Sans", 11.5, HexColor("#B7AE9F"))
    cols = [("Créer", ["Configurateur", "Modèles", "Comment ça marche"]),
            ("La maison", ["Qualité", "FAQ", "Instagram"]),
            ("Informations", ["CGV", "Confidentialité", "Mentions légales"])]
    cx = 640
    for title, items in cols:
        kicker(p, cx, top+42, title, color=HexColor("#8C8475"))
        yy = top+66
        for it in items:
            p.text(cx, yy, it, "Sans", 11.5, HexColor("#CFC7B9")); yy += 22
        cx += 210
    p.line(58, top+fh-44, W-58, top+fh-44, HexColor("#39342C"), 1)
    p.text(58, top+fh-22, "© 2026 Jewel Memories — Fabrication artisanale française", "Sans", 10, HexColor("#857E70"))
    p.text(W-58, top+fh-22, "Paiement sécurisé · Stripe", "Sans", 10, HexColor("#857E70"), align='r')
    return top+fh

def caption_bar(p, top, label, n):
    h = 42
    p.rect(0, top, W, h, fill=PAPER)
    p.line(0, top, W, top, LINE_DK, 1)
    p.text(58, top+26, "Jewel Memories — Maquettes du site", "Sans", 9.5, MUTE, tracking=1.2)
    p.text(W-58, top+26, f"{label.upper()}    ·    {n:02d}", "Sans", 9.5, MUTE, align='r', tracking=1.6)
    return top+h

def band(p, top, h, color): p.rect(0, top, W, h, fill=color)

def section_head(p, top, kick, title, sub=None, sub_w=720, title_size=40, align='c'):
    cx = W/2 if align == 'c' else 0
    y = top
    if kick: kicker(p, cx if align == 'c' else MARGIN, y, kick, align=align); y += 30
    p.text(cx if align == 'c' else MARGIN, y + title_size*0.78, title, "Disp", title_size, INK,
           align=('c' if align == 'c' else 'l'))
    y += title_size + 12
    if sub:
        sx = (W/2 - sub_w/2) if align == 'c' else MARGIN
        y = paragraph(p, sx, y+18, sub, "Sans", 13.5, INK2, sub_w, 22, align=('c' if align == 'c' else 'l'))
    return y

MARGIN = 72

# =====================================================================
def render(c, builder):
    p = P(); H = builder(p)
    c.setPageSize((W, H)); c.saveState(); c.translate(0, H); c.scale(1, -1)
    for fn in p.ops: fn(c)
    c.restoreState(); c.showPage()

# ---------- COVER ----------
def cover(p):
    H = 900
    band(p, 0, H, WHITE)
    kicker(p, MARGIN, 92, "Dossier de direction artistique · 2026")
    p.text(MARGIN, 200, "Jewel", "Disp", 92, INK)
    p.text(MARGIN, 300, "Memories", "Disp", 92, INK)
    p.text(MARGIN, 360, "Maquettes du site", "DispR", 26, CLAY_DK)
    paragraph(p, MARGIN, 430, "Bijoux gravés sur mesure d’après vos souvenirs. "
              "Une identité moderne et chaleureuse, guidée par la photo : du cliché au "
              "pendentif gravé à la main.", "Sans", 14, INK2, 440, 24)
    bx = MARGIN
    for lbl in ["Livraison 7–10 j", "Écrin offert", "Fabrication française"]:
        bx += badge(p, bx, 540, lbl) + 12
    # grand bloc image avant/après
    before_after(p, W-MARGIN-470, 150, 470, 560)
    return H

# ---------- DESIGN SYSTEM ----------
def design_system(p):
    band(p, 0, 1200, WHITE)
    cur = 86
    kicker(p, MARGIN, cur, "Système de design"); cur += 30
    p.text(MARGIN, cur+34, "Les fondamentaux", "Disp", 44, INK); cur += 96
    # palette
    kicker(p, MARGIN, cur, "Palette"); cur += 24
    sw = [("Charcoal", "#1A1714", INK, True), ("Texte", "#46413A", INK2, True),
          ("Gris", "#928A7D", MUTE, True), ("Blanc cassé", "#F6F3ED", PAPER, False),
          ("Sable", "#E9E2D5", SAND, False), ("Terre", "#B07C5B", CLAY, True)]
    cw = (W-2*MARGIN-5*20)/6
    for i, (nm, hx, col, dark) in enumerate(sw):
        x = MARGIN+i*(cw+20)
        p.rect(x, cur, cw, 94, fill=col, stroke=(None if dark else LINE_DK), sw=1, radius=RC)
        p.text(x+14, cur+58, nm, "SansB", 11.5, WHITE if dark else INK)
        p.text(x+14, cur+78, hx, "Sans", 10, HexColor("#D9CDB8") if dark else MUTE)
    cur += 94+64
    # typo
    kicker(p, MARGIN, cur, "Typographie"); cur += 52
    p.text(MARGIN, cur, "Bricolage Grotesque", "Disp", 50, INK)
    p.text(MARGIN, cur+30, "Titres — sans-serif gras, contemporain", "Sans", 12, MUTE)
    cur += 70
    p.line(MARGIN, cur, W-MARGIN, cur, LINE, 1); cur += 44
    p.text(MARGIN, cur, "Outfit — texte courant, interface, libellés et prix", "Sans", 22, INK2)
    cur += 30
    kicker(p, MARGIN, cur, "Outfit · capitales espacées — surtitres & étapes")
    cur += 54
    p.line(MARGIN, cur, W-MARGIN, cur, LINE, 1); cur += 40
    # composants
    kicker(p, MARGIN, cur, "Composants"); cur += 28
    btn(p, MARGIN, cur, 190, 46, "Créer mon pendentif", "primary")
    btn(p, MARGIN+206, cur, 150, 46, "Voir les modèles", "light")
    btn(p, MARGIN+372, cur, 180, 46, "Procéder au paiement", "accent")
    bx = MARGIN
    for lbl in ["Livraison 7–10 j", "Écrin offert"]:
        bx += badge(p, bx, cur+62, lbl) + 12
    # carte produit
    cardx = W-MARGIN-230
    p.rect(cardx, cur-12, 230, 150, fill=PAPER, stroke=LINE, sw=1, radius=RC)
    pendant_art(p, cardx+58, cur+58, 74, "round", "M")
    p.text(cardx+112, cur+44, "Médaille ronde", "SansB", 14, INK)
    p.text(cardx+112, cur+64, "Argent 925", "Sans", 11, MUTE)
    p.text(cardx+112, cur+96, "dès 59 €", "SansB", 19, CLAY_DK)
    cur += 150
    H = cur+70
    p.text(58, H-26, "Jewel Memories — Maquettes du site", "Sans", 9.5, MUTE, tracking=1.2)
    p.text(W-58, H-26, "SYSTÈME    ·    00", "Sans", 9.5, MUTE, align='r', tracking=1.6)
    return H

# ---------- HOMEPAGE ----------
def homepage(p):
    cur = browser_top(p, 0, "jewel-memories.fr")
    cur = site_header(p, cur)
    # HERO
    hero_h = 512
    band(p, cur, hero_h, WHITE)
    hx, hy = MARGIN, cur+92
    kicker(p, hx, hy, "Bijoux gravés sur mesure"); hy += 40
    p.text(hx, hy+10, "Un souvenir.", "Disp", 56, INK); hy += 60
    p.text(hx, hy+10, "Un bijou gravé", "Disp", 56, INK); hy += 60
    p.text(hx, hy+10, "pour toujours.", "Disp", 56, CLAY_DK); hy += 42
    hy = paragraph(p, hx, hy, "Transformez un prénom, une photo ou un symbole qui compte "
                   "en un pendentif gravé à la main. Composez-le en ligne, prévisualisez "
                   "le rendu, et recevez votre pièce sous écrin.", "Sans", 14, INK2, 470, 23) + 14
    btn(p, hx, hy, 200, 50, "Créer mon pendentif", "primary")
    p.text(hx+220, hy+31, "Comment ça marche  →", "SansB", 12.5, INK)
    hy += 76
    bx = hx
    for lbl in ["Livraison 7–10 j", "Écrin offert", "Fabrication française"]:
        bx += badge(p, bx, hy, lbl) + 10
    before_after(p, W-MARGIN-440, cur+74, 440, hero_h-150)
    cur += hero_h
    # bandeau confiance
    band(p, cur, 70, PAPER)
    items = ["★ 4,9/5 · 2 300+ avis", "Gravure laser de précision", "Or 18k · Argent 925", "1 pièce = 1 contrôle"]
    ix = MARGIN
    seg = (W-2*MARGIN)/len(items)
    for i, it in enumerate(items):
        p.text(MARGIN+seg*i+seg/2, cur+42, it, "Sans", 12, INK2, align='c')
        if i < len(items)-1:
            p.line(MARGIN+seg*(i+1), cur+24, MARGIN+seg*(i+1), cur+46, LINE_DK, 1)
    cur += 70
    # COMMENT CA MARCHE — étapes numérotées
    sec_h = 470
    band(p, cur, sec_h, WHITE)
    top = section_head(p, cur+56, "Comment ça marche", "De votre souvenir au bijou, en 4 étapes",
                       "Un parcours simple et guidé, entièrement en ligne.")
    steps = [("01", "Choisissez votre support", "Forme, matière (argent, acier doré, or) et chaîne assortie."),
             ("02", "Composez la gravure", "Texte, photo ou symbole, prévisualisés en direct sur le bijou."),
             ("03", "Nous gravons à la main", "Gravure laser dans notre atelier, puis contrôle une à une."),
             ("04", "Livraison soignée", "Sous écrin, prêt à offrir, en 7 à 10 jours ouvrés.")]
    cwd = (W-2*MARGIN-3*26)/4
    sy = top+46
    for i, (n, t, b) in enumerate(steps):
        x = MARGIN+i*(cwd+26)
        image_panel(p, x, sy, cwd, 132)
        if i == 0: portrait(p, x+cwd/2, sy+62, 80)
        else: pendant_art(p, x+cwd/2, sy+58, 64, ["round","rect","heart","oval"][i])
        p.text(x, sy+170, "ÉTAPE "+n, "SansB", 10, MUTE, tracking=1.6)
        p.text(x, sy+196, t, "Disp", 17, INK)
        paragraph(p, x, sy+218, b, "Sans", 12, INK2, cwd-4, 18)
    cur += sec_h
    # MODES DE GRAVURE — showcase
    sec_h = 432
    band(p, cur, sec_h, PAPER)
    top = section_head(p, cur+56, "Personnalisation", "Trois façons de graver votre histoire",
                       "Photo en line art, texte ou symbole : choisissez le mode qui raconte votre souvenir.")
    modes = [("Photo en line art", "Votre photo transformée en trait", "round"),
             ("Texte gravé", "Un prénom, une date, un mot", "rect"),
             ("Symbole", "Cœur, infini, signe astral…", "heart")]
    mw = (W-2*MARGIN-2*28)/3
    my = top+38
    for i, (t, s_, k) in enumerate(modes):
        x = MARGIN+i*(mw+28)
        p.rect(x, my, mw, 250, fill=WHITE, stroke=LINE, sw=1, radius=RC)
        image_panel(p, x+1, my+1, mw-2, 150, fill=SAND)
        if i == 0: portrait(p, x+mw/2, my+78, 86)
        else: pendant_art(p, x+mw/2, my+74, 70, k)
        p.text(x+24, my+186, t, "Disp", 18, INK)
        p.text(x+24, my+210, s_, "Sans", 12, INK2)
        p.text(x+24, my+234, "En savoir plus  →", "SansB", 11.5, CLAY_DK)
    cur += sec_h
    # AVANT / APRES showcase
    sec_h = 360
    band(p, cur, sec_h, WHITE)
    top = section_head(p, cur+54, "L’effet signature", "De la photo au line art gravé", None, title_size=36)
    before_after(p, MARGIN, top+30, W-2*MARGIN, 196)
    cur += sec_h
    # TEMOIGNAGES
    sec_h = 356
    band(p, cur, sec_h, PAPER)
    top = section_head(p, cur+54, "Avis clients", "Ils ont gravé leur souvenir", None, title_size=36)
    quotes = [("J’ai fait graver le prénom de ma fille. Le rendu est délicat et la qualité irréprochable.", "Camille R.", "round"),
              ("Un cadeau parfait pour les 30 ans de mon compagnon. L’écrin et la finition font la différence.", "Sophie L.", "heart"),
              ("Service au top, livraison rapide, et la gravure est exactement comme sur l’aperçu.", "Marc D.", "oval")]
    qw = (W-2*MARGIN-2*28)/3
    qy = top+34
    for i, (q, a, k) in enumerate(quotes):
        x = MARGIN+i*(qw+28)
        p.rect(x, qy, qw, 168, fill=WHITE, stroke=LINE, sw=1, radius=RC)
        stars(p, x+24, qy+38, 5, 5.5, CLAY, 5)
        paragraph(p, x+24, qy+72, q, "Sans", 13, INK, qw-48, 20)
        p.line(x+24, qy+132, x+qw-24, qy+132, LINE, 1)
        p.circle(x+38, qy+150, 12, fill=SAND); portrait(p, x+38, qy+153, 18)
        p.text(x+58, qy+154, a, "SansB", 12, INK)
    cur += sec_h
    # CTA
    sec_h = 230
    band(p, cur, sec_h, INK)
    p.text(W/2, cur+96, "Et si votre prochain souvenir", "Disp", 38, WHITE, align='c')
    p.text(W/2, cur+142, "devenait un bijou ?", "Disp", 38, CLAY, align='c')
    btn(p, W/2-105, cur+166, 210, 48, "Créer mon pendentif", "accent")
    cur += sec_h
    cur = site_footer(p, cur)
    return caption_bar(p, cur, "Accueil", 1)

# ---------- scaffold pages intérieures ----------
def interior(p, url, kick, title, sub, body_fn, label, num):
    cur = browser_top(p, 0, url)
    cur = site_header(p, cur)
    ph = 196
    band(p, cur, ph, PAPER)
    top = cur+58
    kicker(p, W/2, top, kick, align='c'); top += 32
    p.text(W/2, top+34, title, "Disp", 46, INK, align='c'); top += 54
    if sub: paragraph(p, W/2-360, top+20, sub, "Sans", 13.5, INK2, 720, 22, align='c')
    cur += ph
    cur = body_fn(p, cur)
    cur = site_footer(p, cur)
    return caption_bar(p, cur, label, num)

# ---------- MODELES ----------
def modeles(p):
    def body(p, cur):
        h = 770; band(p, cur, h, WHITE); my = cur+52
        models = [("round","Médaille ronde","Ronde · Ø 18 mm","59 €"),
                  ("rect","Plaque rectangle","Rectangle · 25 × 15 mm","64 €"),
                  ("heart","Cœur","Cœur · 17 mm","62 €"),
                  ("oval","Médaillon ovale","Ovale · 22 × 16 mm","66 €")]
        mw = (W-2*MARGIN-3*26)/4
        for i, (k, nm, meta, pr) in enumerate(models):
            x = MARGIN+i*(mw+26)
            p.rect(x, my, mw, 268, fill=WHITE, stroke=LINE, sw=1, radius=RC)
            image_panel(p, x+1, my+1, mw-2, 156, fill=SAND)
            pendant_art(p, x+mw/2, my+80, 92, k)
            p.text(x+20, my+190, nm, "Disp", 18, INK)
            p.text(x+20, my+212, meta, "Sans", 10.5, MUTE)
            p.text(x+20, my+244, "dès "+pr, "SansB", 18, CLAY_DK)
        my += 268+64
        kicker(p, MARGIN, my, "Les matières")
        p.text(MARGIN, my+38, "Sélectionnez la matière qui vous ressemble", "Disp", 30, INK)
        my += 80
        mats = [("Argent 925","Argent massif, gravure nette et lumineuse.","Inclus"),
                ("Acier doré","Acier inoxydable plaqué or, résistant au quotidien.","+ 10 €"),
                ("Or jaune 18k","Or massif 18 carats, pour les pièces d’exception.","+ 280 €")]
        for nm, desc, pr in mats:
            p.rect(MARGIN, my, W-2*MARGIN, 66, fill=PAPER, stroke=LINE, sw=1, radius=RC)
            p.circle(MARGIN+40, my+33, 13, fill=(SAND2 if nm != "Argent 925" else WHITE), stroke=CLAY, sw=1.2)
            p.text(MARGIN+72, my+30, nm, "Disp", 17, INK)
            p.text(MARGIN+72, my+50, desc, "Sans", 12, INK2)
            p.text(W-MARGIN-26, my+42, pr, "SansB", 18, CLAY_DK, align='r')
            my += 80
        my += 8
        btn(p, W/2-115, my, 230, 48, "Personnaliser mon pendentif", "primary")
        return cur+h
    return interior(p, "jewel-memories.fr/modeles", "Nos modèles", "Choisissez votre support",
                    "Chaque forme est gravable. Sélectionnez la matière qui vous ressemble.", body, "Modèles", 2)

# ---------- CONFIGURATEUR ----------
def configurateur(p):
    BODY_H = 600
    def body(p, cur):
        band(p, cur, BODY_H, WHITE)
        gap = 44
        leftw = (W-2*MARGIN-gap)*0.50; rightw = (W-2*MARGIN-gap)-leftw
        lx, rx = MARGIN, MARGIN+leftw+gap
        top = cur+44
        ly = top
        kicker(p, lx, ly, "1 · Support"); ly += 18
        shapes = [("round","Ronde"),("rect","Plaque"),("heart","Cœur"),("oval","Ovale")]
        bw = (leftw-3*12)/4
        for i, (k, nm) in enumerate(shapes):
            x = lx+i*(bw+12); sel = (i == 0)
            p.rect(x, ly, bw, 92, fill=(PAPER if sel else WHITE), stroke=(INK if sel else LINE), sw=(1.6 if sel else 1), radius=RC)
            pendant_art(p, x+bw/2, ly+40, 42, k)
            p.text(x+bw/2, ly+82, nm, "Sans", 10.5, INK if sel else MUTE, align='c')
        ly += 92+30
        kicker(p, lx, ly, "2 · Matière"); ly += 18
        mats = [("Argent 925","Inclus"),("Acier doré","+10 €"),("Or 18k","+280 €")]
        bw2 = (leftw-2*12)/3
        for i, (nm, pr) in enumerate(mats):
            x = lx+i*(bw2+12); sel = (i == 0)
            p.rect(x, ly, bw2, 62, fill=(PAPER if sel else WHITE), stroke=(INK if sel else LINE), sw=(1.6 if sel else 1), radius=RC)
            p.text(x+bw2/2, ly+30, nm, "SansB", 12, INK, align='c')
            p.text(x+bw2/2, ly+50, pr, "Sans", 11, CLAY_DK, align='c')
        ly += 62+30
        kicker(p, lx, ly, "3 · Votre photo"); ly += 18
        p.rect(lx, ly, leftw, 128, fill=PAPER, stroke=CLAY, sw=1.2, radius=RC)
        cxp = lx+leftw/2
        p.circle(cxp, ly+48, 16, stroke=CLAY, sw=1.4)
        p.line(cxp-7, ly+48, cxp+7, ly+48, CLAY, 1.6); p.line(cxp, ly+41, cxp, ly+55, CLAY, 1.6)
        p.text(cxp, ly+86, "Glissez une photo ou cliquez pour importer", "SansB", 12, INK, align='c')
        p.text(cxp, ly+106, "PNG ou JPEG — convertie en line art par notre IA", "Sans", 10.5, MUTE, align='c')
        # preview
        ph = BODY_H-88
        p.rect(rx, top, rightw, ph, fill=PAPER, stroke=LINE, sw=1, radius=RC)
        kicker(p, rx+26, top+32, "Aperçu en direct")
        image_panel(p, rx+26, top+50, rightw-52, 246, fill=SAND)
        pendant_art(p, rx+rightw/2, top+168, 150, "heart", "L")
        p.text(rx+26, top+334, "Cœur · Argent 925", "Disp", 18, INK)
        p.text(rx+26, top+356, "Gravure : photo en line art", "Sans", 11.5, INK2)
        p.text(rx+rightw-26, top+348, "62 €", "SansB", 26, CLAY_DK, align='r')
        btn(p, rx+26, top+ph-58, rightw-52, 46, "Procéder au paiement", "primary")
        return cur+BODY_H
    return interior(p, "jewel-memories.fr/configurateur", "L’atelier", "Composez votre pendentif",
                    "Choisissez votre support, votre matière, puis importez une photo : notre IA la transforme en line art, prêt à graver.",
                    body, "Configurateur", 3)

# ---------- COMMENT CA MARCHE ----------
def comment_ca_marche(p):
    def body(p, cur):
        h = 720; band(p, cur, h, WHITE); y = cur+58
        steps = [("01","Choisissez votre support","Forme du pendentif, matière (argent, acier doré, or 18k) et chaîne assortie. Tout commence par la pièce qui vous ressemble.","portrait"),
                 ("02","Composez la gravure","Importez votre image : notre IA la transforme en line art, et vous prévisualisez le rendu en direct sur le bijou.","round"),
                 ("03","Nous gravons à la main","Chaque pièce est gravée au laser dans notre atelier, puis contrôlée une à une avant l’expédition.","heart"),
                 ("04","Livraison soignée","Votre bijou arrive sous écrin, prêt à offrir, en 7 à 10 jours ouvrés. Emballage soigné et recyclable.","oval")]
        rowh = 134
        for i, (n, t, b, art) in enumerate(steps):
            iw = 180
            image_panel(p, W-MARGIN-iw, y+6, iw, rowh-30, fill=SAND)
            if art == "portrait": portrait(p, W-MARGIN-iw/2, y+6+(rowh-30)/2, 78)
            else: pendant_art(p, W-MARGIN-iw/2, y+6+(rowh-30)/2-4, 62, art)
            p.text(MARGIN, y+44, n, "Disp", 46, SAND2)
            p.text(MARGIN+96, y+24, "ÉTAPE "+n, "SansB", 10, MUTE, tracking=1.6)
            p.text(MARGIN+96, y+50, t, "Disp", 24, INK)
            paragraph(p, MARGIN+96, y+78, b, "Sans", 13.5, INK2, W-2*MARGIN-96-iw-40, 21)
            if i < 3: p.line(MARGIN, y+rowh-14, W-MARGIN, y+rowh-14, LINE, 1)
            y += rowh
        y += 22
        btn(p, W/2-105, y, 210, 50, "Créer mon pendentif", "primary")
        return cur+h
    return interior(p, "jewel-memories.fr/comment-ca-marche", "Le processus", "Comment ça marche",
                    "Créer un bijou gravé n’a jamais été aussi simple. Tout se passe en ligne, en quelques minutes.",
                    body, "Comment ça marche", 4)

# ---------- QUALITE ----------
def qualite(p):
    def body(p, cur):
        h = 700; band(p, cur, h, WHITE); y = cur+52
        cards = [("Gravure laser de précision","Un trait net, durable et fidèle à votre aperçu, jusque dans les plus fins détails."),
                 ("Des matériaux nobles","Argent massif 925, acier inoxydable plaqué or, ou or 18 carats, choisis pour durer."),
                 ("Contrôle à l’unité","Chaque pièce est inspectée à la main avant l’expédition. Aucune ne part sans vérification."),
                 ("Fabrication responsable","Production à la commande, sans surstock, emballages soignés et recyclables.")]
        cw = (W-2*MARGIN-30)/2; ch = 152
        for i, (t, b) in enumerate(cards):
            x = MARGIN+(i % 2)*(cw+30); yy = y+(i//2)*(ch+26)
            p.rect(x, yy, cw, ch, fill=PAPER, stroke=LINE, sw=1, radius=RC)
            p.text(x+30, yy+52, f"0{i+1}", "Disp", 30, SAND2)
            p.text(x+86, yy+44, t, "Disp", 20, INK)
            paragraph(p, x+86, yy+68, b, "Sans", 12.5, INK2, cw-118, 19)
        y += 2*ch+26+54
        p.rect(MARGIN, y, W-2*MARGIN, 132, fill=INK, radius=RC)
        p.text(W/2, y+62, "Un bijou n’a de valeur que par l’histoire qu’il porte.", "DispR", 26, WHITE, align='c')
        p.text(W/2, y+96, "— L’ATELIER JEWEL MEMORIES", "SansB", 10.5, CLAY, align='c', tracking=2)
        return cur+h
    return interior(p, "jewel-memories.fr/qualite", "Notre savoir-faire", "Une qualité qui se transmet",
                    "Parce qu’un bijou-souvenir doit durer toute une vie, nous ne transigeons sur rien.",
                    body, "Qualité", 5)

# ---------- FAQ ----------
def faq(p):
    def body(p, cur):
        qs = [("Quels sont les délais de fabrication et de livraison ?",
               "Chaque pièce est gravée à la commande dans notre atelier. Comptez 7 à 10 jours ouvrés entre la validation de votre commande et la réception, écrin et livraison soignée compris."),
              ("Quelles gravures puis-je choisir ?", None),
              ("Comment fonctionne la conversion de ma photo ?", None),
              ("Quels matériaux proposez-vous ?", None),
              ("Comment entretenir mon bijou gravé ?", None),
              ("La chaîne est-elle incluse ?", None),
              ("Puis-je retourner ma commande personnalisée ?", None)]
        rows = []; y = cur+48
        for q, a in qs:
            rows.append((y, q, a))
            rh = 66
            if a: rh = 66 + len(wrap(a, "Sans", 13, W-2*MARGIN-90))*21 + 14
            y += rh
        h = (y-cur)+56; band(p, cur, h, WHITE)
        for (yy, q, a) in rows:
            p.text(MARGIN, yy+36, q, "Disp", 19, INK)
            p.text(W-MARGIN-12, yy+40, "–" if a else "+", "Sans", 20, CLAY_DK, align='r')
            ny = yy+58
            if a: ny = paragraph(p, MARGIN, yy+60, a, "Sans", 13, INK2, W-2*MARGIN-90, 21)+8
            p.line(MARGIN, ny if a else yy+58, W-MARGIN, ny if a else yy+58, LINE, 1)
        return cur+h
    return interior(p, "jewel-memories.fr/faq", "Questions fréquentes", "On répond à tout",
                    "Vous ne trouvez pas votre réponse ? Écrivez-nous, nous répondons rapidement.",
                    body, "FAQ", 6)

# ---------- PAIEMENT ----------
def paiement(p):
    def body(p, cur):
        h = 640; band(p, cur, h, WHITE)
        gap = 40
        leftw = (W-2*MARGIN-gap)*0.54; rightw = (W-2*MARGIN-gap)-leftw
        lx, rx = MARGIN, MARGIN+leftw+gap; top = cur+46
        p.rect(lx, top, leftw, 360, fill=PAPER, stroke=LINE, sw=1, radius=RC)
        kicker(p, lx+28, top+34, "Récapitulatif")
        image_panel(p, lx+28, top+50, 120, 120, fill=SAND); pendant_art(p, lx+88, top+110, 90, "heart")
        p.text(lx+170, top+92, "Pendentif Cœur", "Disp", 21, INK)
        p.text(lx+170, top+116, "Gravure : photo en line art", "Sans", 12, INK2)
        rows = [("Support — Cœur (17 mm)","62 €"),("Matière — Argent 925","Inclus"),
                ("Gravure — line art","Inclus"),("Écrin & livraison","Offert")]
        ry = top+196
        for label, val in rows:
            p.text(lx+28, ry, label, "Sans", 12.5, INK2)
            p.text(lx+leftw-28, ry, val, "Sans", 12.5, INK, align='r'); ry += 28
        p.line(lx+28, ry-2, lx+leftw-28, ry-2, LINE, 1)
        p.text(lx+28, ry+30, "Total", "Disp", 19, INK)
        p.text(lx+leftw-28, ry+32, "62 €", "SansB", 24, CLAY_DK, align='r')
        p.rect(rx, top, rightw, 360, fill=PAPER, stroke=LINE, sw=1, radius=RC)
        kicker(p, rx+28, top+34, "Coordonnées & paiement")
        p.text(rx+28, top+72, "Adresse email", "Sans", 11.5, INK2)
        p.rect(rx+28, top+84, rightw-56, 44, fill=WHITE, stroke=LINE_DK, sw=1, radius=RC)
        p.text(rx+42, top+111, "vous@email.com", "Sans", 12.5, MUTE)
        p.rect(rx+28, top+142, rightw-56, 44, fill=WHITE, stroke=LINE_DK, sw=1, radius=RC)
        p.circle(rx+52, top+164, 8, stroke=CLAY, sw=1.4); p.text(rx+52, top+168, "G", "SansB", 10, CLAY_DK, align='c')
        p.text(rx+rightw/2+8, top+168, "Continuer avec Google", "SansB", 12, INK, align='c')
        p.line(rx+28, top+210, rx+rightw/2-22, top+210, LINE, 1)
        p.text(rx+rightw/2, top+214, "ou", "Sans", 11, MUTE, align='c')
        p.line(rx+rightw/2+22, top+210, rx+rightw-28, top+210, LINE, 1)
        btn(p, rx+28, top+232, rightw-56, 50, "Procéder au paiement — Stripe", "accent")
        p.text(rx+rightw/2, top+306, "Paiement 100% sécurisé via Stripe", "Sans", 11, MUTE, align='c')
        sy = top+392
        p.rect(MARGIN, sy, W-2*MARGIN, 88, fill=PAPER, stroke=CLAY, sw=1, radius=RC)
        p.circle(MARGIN+52, sy+44, 18, fill=CLAY)
        def chk(c):
            c.setStrokeColor(WHITE); c.setLineWidth(2.4); c.setLineCap(1)
            pa = c.beginPath(); pa.moveTo(MARGIN+44, sy+44); pa.lineTo(MARGIN+50, sy+50); pa.lineTo(MARGIN+61, sy+37)
            c.drawPath(pa, stroke=1, fill=0)
        p.ops.append(chk)
        p.text(MARGIN+90, sy+40, "Merci ! Votre paiement a bien été reçu.", "Disp", 19, INK)
        p.text(MARGIN+90, sy+62, "Nous lançons la fabrication et vous tenons informé par email à chaque étape.", "Sans", 12, INK2)
        p.text(W-MARGIN-24, sy+50, "/paiement/succes", "Sans", 11, CLAY_DK, align='r')
        return cur+h
    return interior(p, "jewel-memories.fr/paiement", "Dernière étape", "Finaliser votre commande",
                    "Vérifiez votre pendentif, renseignez votre email, puis réglez en paiement sécurisé.",
                    body, "Paiement", 7)

# =====================================================================
PAGES = [cover, design_system, homepage, modeles, configurateur,
         comment_ca_marche, qualite, faq, paiement]
c = canvas.Canvas("/home/user/Jewel-memories/design/Jewel-Memories-Mockups.pdf", pagesize=(W, 900))
for b in PAGES: render(c, b)
c.save()
print("OK", len(PAGES), "pages")
