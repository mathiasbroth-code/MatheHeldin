# Audit: 08-division.json
Geprüft: 49 Aufgaben (keine Platzhalter vorhanden)

Alle Rechnungen wurden maschinell nachgerechnet (Python). Jede Division, Multiplikation und Quersumme wurde verifiziert.

---

## Fehler

- **#32** "Welche Ziffern fehlen? — Lückendivision", Teilaufgabe b: Formatierungsfehler im `frage`-Feld. Die Darstellung lautet `"2___34 : 3 = 678"` (mit drei Unterstrichen), was optisch eine 6-stellige Zahl suggeriert. Die korrekte Lösung `678 · 3 = 2.034` ergibt aber eine 4-stellige Zahl. Das Lückenformat müsste `"2_34 : 3 = 678"` lauten (genau eine Lücke für die Zehnerstelle 0). Die Mathematik ist korrekt (678 · 3 = 2.034), aber das Format ist irreführend.

---

## Warnungen

- **#0** "Vielfache aufschreiben — Zahlenreihe fortsetzen": `parsed.items[].antwort` enthält nur das letzte Vielfache (`"60"` bzw. `"90"`). Die Aufgabenstellung fordert aber alle 7 bzw. 8 Lücken auszufüllen. Ein Kind muss die Reihe komplett eintragen, bekommt aber als Antwort nur die Endzahl. Das ist für ein `eingabe`-Format mit sieben Blanks nicht ausreichend — es müsste entweder der vollständige Lückentext als Antwort stehen oder der Typ auf `luecke` mit Einzelfeldern umgestellt werden.

- **#22** "Fehlende Einerstelle — Teilbar machen": `parsed.items[].antwort` enthält erklärendende Texte statt einfacher Eingabewerte. Beispiel Teilaufgabe a: `"Durch 5 teilbar → Einerstelle 0 oder 5: 780/785, 430/435, ..."`. Ein Kind, das die Antwort eintippen soll, kann diesen Satz nicht schreiben. Für `typ=luecke` sollte die Antwort das tatsächlich einzugebende Zeichen(folge) sein — z. B. `"0 oder 5"` für Teilaufgabe a und `"0"` für Teilaufgabe c. (Typ-Wahl `luecke` ist grundsätzlich passend, nur das `antwort`-Format ist inkonsistent zur Typ-Erwartung.)

- **#27** "Fehlende Einerstelle — Teilbar durch 3 und/oder 9": Gleiche Problematik wie #22. Teilaufgabe-c-Antwort lautet `"Durch 3 UND 9: dieselbe Antwort wie b), denn jede durch 9 teilbare Zahl ist auch durch 3 teilbar."` — das ist keine eingabefähige Antwort, sondern eine Erklärung. Außerdem fehlt in Teilaufgabe b der vollständige Antwortwert für `435_` (nur `783_` wird in der `antwort` aufgeführt, `435_` fehlt). Die `loesung` im Elternobjekt ist vollständig, aber `parsed.items[b].antwort` ist unvollständig.

- **#38** "Fehler finden — Typische Rechenfehler korrigieren": `typ=wahr-falsch` passt nicht zur Aufgabe. Die Aussagen `"6.416 : 8 = 82 (falsch berechnet)"` enthalten bereits die Information "falsch berechnet" — es gibt nichts zu beurteilen. Die eigentliche Aufgabe ist: "Rechne richtig nach." Das wäre besser als `typ=eingabe` mit der Frage nach dem korrekten Ergebnis modelliert. Als Workaround ist `richtig=true` für beide Items gesetzt (Bedeutung: "Ja, es ist ein Fehler"), aber das ist semantisch verwirrend und widerspricht dem `wahr-falsch`-Muster, bei dem `richtig` die Korrektheit der Aussage angibt.

- **#25** "Fehlende Einerstelle für Teilbarkeit durch 9": `parsed.items[].antwort` enthält sowohl die gesuchte Ziffer als auch eine Probe in Klammern, z. B. `"1 (8.541 : 9 = 949)"`. Das Antwortformat ist für Kinder nicht direkt eingabefähig — die gesuchte Ziffer wäre `"1"`, der Rest ist Erklärung. Für eine `luecke`-Aufgabe sollte `antwort` nur die Ziffer enthalten. (Mathematisch korrekt: 8 + 5 + 4 = 17, fehlt 1 bis 18; 8.541 : 9 = 949; 2 + 6 + 7 = 15, fehlt 3 bis 18; 2.673 : 9 = 297; 6 + 3 + 4 = 13, fehlt 5 bis 18; 6.345 : 9 = 705 — alles stimmt.)

- **#6** "Gemeinsame Teiler finden": `parsed.items[a].antwort` enthält die vollständigen Teilerlisten aller drei Zahlen (`"T₁₀ = {1, 2, 5, 10}, T₃₀ = {...}, T₅₀ = {...}"`), aber die eigentliche gesuchte Antwort wäre `"1, 2, 5, 10"` (die gemeinsamen Teiler). Die komplexe Mengennotation ist für ein 9-jähriges Kind nicht eingabefähig. `typ=textaufgabe` ist dafür zwar flexibler, aber die `antwort` sollte die Kernlösung in den Vordergrund stellen.

---

## Mathematische Korrektheit

Alle 49 Aufgaben rechnen korrekt nach. Keine mathematischen Fehler gefunden. Im Einzelnen geprüft:

- Vielfache (6er- und 9er-Reihe), gemeinsame Vielfache, Lisas Zahlenrätsel (7·80+4·x=600 → x=10)
- Alle Teiler von 12, 18, 20, 18, 24, 45 (inkl. Anzahl)
- Alle halbschriftlichen Divisionen (2- bis 4-stellig), inkl. Zerlegungsschritte
- Alle schriftlichen Divisionen (4- und 5-stellig), inkl. Zwischenschritte, Reste und Proben
- Teilbarkeitsregeln für 2, 4, 5, 9, 10 und alle Quersummen
- Alle Cent-Umrechnungen und Geldaufgaben (Sponsorenlauf, Preisvergleich, Klassenvergleich)
- Ferienlager-Rätsel (kgV(2,3,5)=30, 30+1=31)
