# Audit: 07-kombinatorik-wahrscheinlichkeit.json
Geprüft: 34 Aufgaben (1 Platzhalter übersprungen: #22 "Welche Wörter sind schwer zu erraten?")

---

## Fehler

### Mathematik

Keine mathematischen Fehler gefunden. Alle nachgerechneten Ergebnisse stimmen:

- #1 3! = 6 ✓
- #2 C(4,2) = 6 ✓
- #3 3! = 6 ✓
- #4 3! = 6 (erste Stelle fest) ✓, alle 6 Codes korrekt ✓
- #5 C(4,2) = 6 ✓
- #6 3 + 3 = 6 Spiele, 6 × 15 = 90 Minuten = 1h 30min ✓
- #7 4! = 24, kleinste 2.468, größte 8.642 ✓
- #8 C(3,2) = 3 ✓
- #9 Min=2, Max=12, unmöglich=1 ✓
- #10 Augensummen 2→1, 3→2, 4→3, 5→4, 6→5, 7→6 ✓
- #11 Zuordnungen alle korrekt ✓
- #12 Drei Würfel Min=3, Max=18, alle Zuordnungen korrekt ✓
- #13 Gerade: 18, Ungerade: 18 (Regel A fair); Summe>7: 15, Summe<7: 15 (Regel B fair) → beide fair ✓
- #14 Durch 4 teilbar: 4(3)+8(5)+12(1) = 9; durch 3 teilbar: 3(2)+6(5)+9(4)+12(1) = 12 → Kind 2 gewinnt häufiger ✓
- #15 Produkt min=1, max=36; häufigste Produkte 6 und 12 (je 4 Wege) ✓
- #18 D=2, E=5, R=3, N=3, I=2, G=2, S=1, T=2 ✓ (manuell nachgezählt)
- #19 E=10 häufigster Buchstabe, S kommt nicht vor ✓
- #21 Alle fünf Wahr/Falsch-Aussagen korrekt bewertet (R+A=7+8=15=E ✓) ✓
- #23 E=22 im Feuertext ✓, nicht vorkommende Buchstaben J,P,Q,X,Y,Z korrekt ✓
- #25–#29 Alle Würfelaufgaben mathematisch korrekt ✓
- #30 E in ERDBEERE: 4 ✓
- #31 A in ANANAS=3, BANANE=2, PAPAYA=3 ✓
- #32 E in Satz: 11 ✓
- #33 DINOSAURIER: A=1, E=1, I=2, O=1, U=1 ✓
- #34 A/Ä in Satz: 9, E: 7 → A ist häufigster Buchstabe ✓
- #35 Vokale (ohne Ü): 13 ✓

---

### Struktur-Fehler

- **#2 "Fotos zu zweit — Kombination vs. Reihenfolge"**: Das `parsed.items[0].frage`-Feld enthält den Hinweistext `"(Hinweis: Ali+Jana ist das gleiche Foto wie Jana+Ali — die Reihenfolge spielt keine Rolle.)"` anstelle der eigentlichen Frage `"Wie viele verschiedene Fotos können entstehen?"`. Die echte Frage steht nur in `kontext`/`anweisung`. Ein Kind, das nur das `frage`-Feld angezeigt bekommt, sieht keine Frage, sondern einen Hinweis.

- **#19 "Buchstaben in einem kurzen Text zählen"**: `parsed.items[0].antwort = "E, N, R, T, H"` ist unvollständig und damit für automatische Auswertung fehlerhaft. N, R und T liegen alle gleichauf bei 5 (Rang 2–4). H, L und O liegen gleichauf bei 3 (Rang 5–7). Ein Kind, das `"E, N, R, T, L"` oder `"E, N, R, T, O"` eingibt, würde zu Unrecht als falsch bewertet. Die `loesung` im Freitext beschreibt das richtig (`H/L/O je 3`), aber die `parsed.antwort` setzt willkürlich nur H als 5. Buchstaben.

---

## Warnungen

### Antwort-Format (Kind kann Antwort nicht wie angegeben eingeben)

- **#2 "Fotos zu zweit"**: `antwort = "6 verschiedene Fotos."` — Ein Eingabefeld erwartet eine Zahl; Erklärungstext als Antwort ist nicht eingabbar.

- **#8 "Eissorten kombinieren"**: `antwort = "3 Kombinationen: V+S, V+E, S+E"` — Erklärungstext statt Zahl. Sollte `"3"` sein; die Aufzählung gehört in den Lösungsweg.

- **#14 "Gewinnchance — durch 4 oder durch 3 teilbar?"**: `antwort` für Teilaufgabe a = `"Kind 2 hat die größere Gewinnchance."` und für b = `"Nein, das Spiel ist unfair."` — vollständige Sätze, die ein Kind nicht als Eingabe tippen kann. Geeigneter wären: a) `"Kind 2"`, b) `"Nein"`.

- **#15 "Würfelprodukt"**: `antwort` für Teilaufgabe c = `"Die 6 und die 12 haben die größte Chance (jeweils 4 Möglichkeiten: 6→1×6, 2×3, 3×2, 6×1; 12→2×6, 3×4, 4×3, 6×2)."` — mehrzeiliger Erklärungstext. Als Eingabe nicht sinnvoll. Geeigneter: `"6 und 12"`.

- **#6 "Zwei Gruppen"**: `antwort` für Teilaufgabe d = `"90 Minuten = 1 Stunde 30 Minuten"` — Gleichungsformat als Antwort. Konsistenter wäre `"90"` (Zahl) oder `"90 Minuten"` (Einheit). Das Format ist akzeptabel für textaufgabe-Typ, aber inkonsistent mit den anderen Feldern.

### Tipp-Qualität

- **#11 "Sicher, möglich oder unmöglich?"**: Tipp 4 (Lösung) enthält das Schreibfehler `"Man prüeft"` statt `"Man prüft"`. Kindgerechte Sprache — Tippfehler sollte korrigiert werden.

### Typ-Passung

- **#2 "Fotos zu zweit"**: `typ = "textaufgabe"` passt — aber die parsed-Struktur mit einem einzigen Item, das den Hinweistext als `frage` hat, ist für die Rendering-Logik unbrauchbar. Die eigentliche Frage fehlt in `items[].frage`. Entweder die Frage korrekt eintragen oder den Typ zu `eingabe` wechseln.

### Sonstiges

- **#19 "Buchstaben in einem kurzen Text"**: Die `loesung`-Tabelle ist vollständig und korrekt. Jedoch ist der Didaktische Hinweis widersprüchlich: Er sagt `"Das bestätigt die Vermutung aus Aufgabe 17"` — Aufgabe 17 handelt aber von Häufigkeiten im Deutschen allgemein, während Aufgabe 19 nur einen sehr kurzen Text mit 10 Wörtern analysiert. Bei so wenigen Daten wäre E nicht zwingend häufigster Buchstabe. Der Text ist aber tatsächlich E-dominiert (10×), sodass die Aussage faktisch stimmt — aber pädagogisch schwach begründet.

- **#20 "Säulendiagramm"**: `digital = "teilweise"` korrekt, da Zeichnen nicht digital machbar ist. Aber der loesungsweg nennt `"I: 5 ÷ 2 = 2,5 Kästchen (halbes Kästchen)"` — das ist korrekt und ehrlich, könnte aber für 9-Jährige verwirrend sein. Didaktischer Hinweis fehlt zu dieser Schwierigkeit im `didaktischerHinweis`-Feld (er erwähnt es, aber im `tipps[3]` ist die halbe Kästchen-Sache nicht besonders hervorgehoben).

---

## Zusammenfassung

| Kategorie | Anzahl |
|-----------|--------|
| Mathematische Fehler | 0 |
| Struktur-Fehler | 2 |
| Antwort-Format-Warnungen | 5 |
| Tipp-/Sprachfehler | 1 |
| Typ-Passung-Warnungen | 1 |

**Dringend zu fixen:** #2 (kaputtes frage-Feld), #19 (willkürliche 5. Platz-Antwort), #14/#15 (Satz-Antworten bei Eingabe-Aufgaben).
