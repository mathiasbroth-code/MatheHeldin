# Audit: 09-alltagsbrueche-hohlmasse-masseinheiten.json
Geprüft: 46 Aufgaben (ohne 2 Platzhalter: #1, #47)

---

## Fehler

- **#0 "Pizza teilen — Bruch verstehen":** `parsed.items[1].antwort` ist `"1"` statt `"1/4 (ein Viertel)"`. Offensichtlicher Datenschnittfehler — der korrekte Wert steht in `loesung` und in Item c ist die Antwort wieder korrekt formuliert. Kein Kind kann mit der Antwort `"1"` für Teilaufgabe b etwas anfangen.

- **#5 "Pizza gerecht verteilen — Anteile planen":** `parsed.items[1].antwort` ist `"3/4 einer Pizza"` — das ist kein eingebbarer Wert, sondern ein Erklärungstext. Ein Kind würde hier `"3/4"` eingeben; der Text "einer Pizza" gehört nicht zur Eingabe-Antwort. Ebenfalls: `typ` ist `eingabe`, aber `digital` ist `"teilweise"`, was inkonsistent ist — wenn die Aufgabe nur teilweise digital ist, sollte Teilaufgabe b als eigener Hinweis markiert sein oder der Typ angepasst werden.

- **#8 "Milliliter und Liter — Grundumrechnung":** `parsed.items[2].antwort` (Teilaufgabe c: 500 ml = ___ l) ist `"0,5 l (oder 1/2 l)"`. Der eingeklammerte Alternativtext ist für eine Eingabe-Antwort nicht maschinenlesbar. Ein Kind würde `"0,5"` oder `"1/2"` eingeben. Das Lösungsfeld muss auf eine einzige gültige Eingabe normiert sein — z. B. `"0,5"` mit `"1/2"` als Hinweis im Erklärungs-Text.

- **#14 "Kniffelaufgabe — 4 Liter abmessen":** `parsed.items[0].antwort` ist `"Schritt 1: Fülle den 5-Liter-Eimer voll."` — nur der erste Schritt der mehrstufigen Lösung ist als Antwort hinterlegt, die Schritte 2–8 fehlen vollständig. Das ist ein unvollständiges `parsed`-Objekt. Außerdem ist `typ` auf `"textaufgabe"` gesetzt, obwohl `digital: "teilweise"` — das ist vertretbar, aber der `parsed`-Block ist klar unvollständig.

- **#32 "Quader für 160 ml finden — rückwärts rechnen":** `parsed.items[0].antwort` ist `"- 8 cm × 5 cm × 4 cm = 160 cm³"` — nur eine der fünf möglichen Lösungen aus `loesung` ist abgebildet. Die Aufgabe verlangt explizit **zwei** Möglichkeiten; das `parsed`-Objekt nennt aber nur eine. Das `antwort`-Feld kann für eine Validierungs-Engine so nicht verwendet werden.

- **#39 "Bruchteile umrechnen — Stunde, Meter, Kilogramm":** `parsed.items[2].antwort` (Teilaufgabe c: 1/2 m = ___ cm) ist `"50"`, was rechnerisch korrekt ist (1 m = 100 cm, Hälfte = 50 cm). **Kein Fehler hier**, aber siehe Warnung unten.

- **#46 "Millionen-Quiz — Überschlagen und schaetzen":** Die `parsed`-Struktur ist strukturell kaputt. Die Aufgabe besteht aus vier unabhängigen Auswahl-Fragen (a, b, c, d), aber `parsed` enthält nur eine einzige `optionen`-Liste mit A/B/C/D für die vier Buchstaben des Alphabets — und `richtigeIdx: 0` (zeigt auf A = "1.000.000 mm ="). Das ist **keine sinnvolle Frage-Antwort-Kodierung**: Die vier Teil-Fragen a/b/c/d sind nicht als separate Auswahl-Items kodiert, und es gibt keine Antwortoption pro Teilfrage. Die loesung (`"a) 1 km, b) 1.000 kg, c) 1.000 l, d) 10 Tage"`) ist im `parsed`-Block überhaupt nicht abbildbar. Der gesamte `parsed`-Block muss neu strukturiert werden (z. B. als 4 separate `items` jeweils mit zwei Optionen).

---

## Warnungen

- **#4 "Gefärbter Anteil des Kreises — Bruch ablesen":** Bei Teilaufgaben b, c, d gibt es jeweils zwei korrekte Antworten (z. B. `"2/4 oder 1/2"`), aber `parsed.items[].antwort` enthält nur die vereinfachte Form (`"1/2"`, `"3/4"`, `"1/2"`). Das ist pädagogisch sinnvoll (Vereinfachung bevorzugen), muss aber in der Validierungs-Engine als "auch 2/4 akzeptieren" berücksichtigt werden — sonst wird ein korrekt eingegebenes `"2/4"` als falsch gewertet.

- **#5 "Pizza gerecht verteilen — Anteile planen":** `parsed.items[0].antwort` ist `"3"` (drei Viertel), aber die Frage lautet "Jedes Kind bekommt ___ Viertel." — Antwort `"3"` ist korrekt. Der `typ` `"eingabe"` passt. Die Konsistenz zwischen `digital: "teilweise"` und `typ: "eingabe"` sollte dennoch dokumentiert werden (Teilaufgabe b ist die teilweise-digitale Einschränkung).

- **#15 "Täglicher Wasserverbrauch — Summe berechnen":** Rechenprüfung: 12 + 45 + 44 + 19 + 7 + 6 + 10 + 2 = 145. Stimmt. Aber `parsed.items[0].antwort` enthält den vollständigen Rechenweg `"12 + 45 + 44 + 19 + 7 + 6 + 10 + 2 = 145 l"` — für eine Eingabe-Antwort ist das kein eingebbarer Wert. Die Antwort sollte `"145"` oder `"145 l"` sein; der Rechenweg gehört in `loesungsweg`.

- **#16 "Wasserverbrauch hochrechnen — Woche und Monat":** Rechenprüfung: 145 × 7 = 1.015 ✓. 145 × 30 = 4.350 ✓. `parsed.items[].antwort` enthält jeweils den vollen Rechenweg (`"145 × 7 = 1.015 l"`). Gleiches Problem wie #15: kein eingebbarer Wert für ein Kind.

- **#17 "Wasserverbrauch einer Familie":** Rechenprüfung: 4 × 145 = 580 ✓. 580 × 30: 580 × 3 = 1.740, × 10 = 17.400 ✓. Gleiche Antwort-Format-Warnung wie #15/#16.

- **#18 "Wasser sparen beim Zähneputzen":** Rechenprüfung: Lisa: 3 × 3 × 12 = 108 l/Tag ✓. Max: 3 × 2 × 15 s = 90 s = 1,5 min. 1,5 × 12 = 18 l/Tag ✓. Ersparnis: 108 − 18 = 90 l/Tag ✓. 90 × 7 = 630 l/Woche ✓. `parsed.items[].antwort` enthält wieder erklärende Texte statt reine Zahlen (`"Ersparnis pro Tag: 108 - 18 = 90 l"`). Gleiches Muster wie #15–17.

- **#19 "Tropfender Wasserhahn — hochrechnen":** Rechenprüfung: 60 × 8 = 480 ml ✓. 24 × 480 = 11.520 ml ✓. 7 × 11.520 = 80.640 ml ✓. Gleiches Antwort-Format-Problem.

- **#22 "Burger-Wasserverbrauch — Vergleich mit Alltag":** Rechenprüfung: 145 × 16 = 2.320, 145 × 17 = 2.465. 2.450 liegt zwischen 16 und 17, also ca. 16 Tage ✓. Der Rest: 2.450 − 2.320 = 130 ✓. `parsed.items[0].antwort` enthält erklärenden Text statt einen eingabbaren Wert. Gleiches Muster.

- **#24 "Schokolade und Wasser — Kann das stimmen?":** Die Antwort-Kodierung in `parsed.items[0].antwort` gibt nur den ersten Rechenschritt wieder. Die vollständige Argumentation (59 kg → nicht realistisch) fehlt im `parsed`-Block. Das ist für eine offene Prüf-Aufgabe tolerierbar, sollte aber konsistent mit dem `typ` "textaufgabe" gehandhabt werden.

- **#33 "Welche Maßeinheit passt? — zuordnen":** Der Typ ist `luecke`, aber `parsed.items[3].antwort` ist `"m, s"` — zwei Einheiten in einem Feld. Für ein digitales Eingabefeld ist das problematisch, da die Frage zwei Lücken hat (`Ali läuft 100 ___ in 18 ___`). Im Typ `luecke` sollte das als zwei separate Items modelliert werden.

- **#34 "Aussagen prüfen — richtige Maßeinheit?":** `typ` ist `wahr-falsch` und die `parsed`-Struktur mit `richtig: true/false` + `erklaerung` ist korrekt aufgebaut. Kein mathematischer Fehler. Kleinigkeit: Das Emoji ✓ in `erklaerung` ("Stimmt ✓") könnte je nach Renderer Probleme machen — neutraler wäre "Stimmt".

- **#35 "Richtige Maßeinheit einsetzen":** `parsed.items[2].antwort` ist `"h (Stunden)"` — der Klammertext "Stunden" ist kein eingebbarer Wert. Sollte `"h"` sein; der Hinweis gehört in den Tipp oder die Erklärung. Analog: `"1.000 m"` in Item d enthält die Einheit, obwohl die Frage `"___ m"` schon die Einheit vorgibt — Antwort sollte `"1.000"` sein.

- **#37 "Umrechnungstabelle ausfüllen — alle Größen":** `parsed.items[].antwort` enthält durchgehend Einheiten (`"10 mm"`, `"10 cm"` usw.), obwohl die Fragen die Einheit bereits vorgeben (`"1 cm = ___ mm"`). Die Antworten sollten reine Zahlen sein (`"10"`, `"10"` usw.) — sonst muss die Eingabe-Engine die Einheit parsen.

- **#39 "Bruchteile umrechnen — Stunde, Meter, Kilogramm":** Rechenprüfung: 1/4 h = 15 min ✓, 1/2 h = 30 min ✓, 1/2 m = 50 cm ✓, 1/4 km = 250 m ✓, 1/2 t = 500 kg ✓, 1/2 km = 500 m ✓. Alles korrekt. Keine Fehler.

- **#41 "Eine Million Sekunden — wie viele Tage?":** Rechenprüfung: 60 s/min ✓, 60 × 60 = 3.600 s/h ✓, 24 × 3.600 = 86.400 s/Tag ✓. 1.000.000 : 86.400 = 11,574… Tage. `loesung` sagt "ca. 12 Tage" — das ist gerundet und akzeptabel, aber 11,574 liegt näher an 12 als an 11, also ist "ca. 12 Tage" vertretbar. Die `parsed`-Antwort `"ca. 12 Tage"` enthält einen Erklärungstext statt einer reinen Zahl; für ein Kind wäre `"12"` die klare Eingabe. Kein Fehler, aber Formatwarnung.

- **#46 "Millionen-Quiz":** Rechenprüfung der Lösungen: a) 1.000.000 mm = 1.000.000/10 = 100.000 cm = 1.000 m = **1 km** ✓. b) 1.000.000 g = 1.000 kg ✓. c) 1.000.000 ml = 1.000 l ✓. d) 1.000.000 s / 86.400 ≈ 11,6 Tage → näher an **10** als an 1 ✓. Alle Lösungen sind mathematisch korrekt; das Problem ist rein die fehlerhafte `parsed`-Struktur (siehe Fehler-Abschnitt).

---

## Zusammenfassung

| Schwere | Anzahl | Betroffene Aufgaben |
|---------|--------|---------------------|
| Fehler (blockierend) | 6 | #0, #5, #8, #14, #32, #46 |
| Warnungen (Antwort-Format) | ~12 | #4, #15–19, #22, #24, #33, #35, #37, #41 |

**Größte Baustellen:**
1. **Antwort-Format-Muster:** Viele `textaufgabe`-Items in `parsed` haben den vollen Rechenweg als `antwort` statt einen eingebbaren Wert. Das ist ein durchgehendes Muster vor allem im Wasserverbrauchs-Block (#15–#19, #22). Entweder den `typ` dieser Items auf etwas Freitext-freundlicheres ändern oder die `antwort`-Felder auf reine Zahlen normieren.
2. **Drei echte Datenfehler:** #0 (Antwort "1" statt "1/4"), #14 (Lösung abgeschnitten), #46 (`parsed` strukturell falsch).
