# Audit: intensiv-kombinatorik-einheiten.json
Geprüft: 73 Aufgaben (ohne Platzhalter)

## Fehler
- #63 "Geheimschrift knacken": Die Antwort auf Teilaufgabe b) behauptet, "U" komme 2-mal in der verschlüsselten Nachricht "NBUI JTU UPMM" vor. Tatsächlich kommt U 3-mal vor (je einmal in NBUI, JTU und UPMM). Korrekte Antwort: "U kommt 3-mal vor. U steht für T."

## Warnungen
- #7 "Fehlende Teilstrecke berechnen — Busfahrt": parsed.items[0].antwort = "5,2 km" enthält die Einheit. Ein Kind, das nur "5,2" eingibt, sollte auch als korrekt gewertet werden. Gleiches gilt fuer viele Entfernungs- und Geschwindigkeits-Aufgaben in dieser Datei (z.B. #8, #9, #10, #11).
- #14 "Geschwindigkeit berechnen — Wer ist schneller?": parsed.items[2].antwort = "Radfahrer (15 km/h > 6 km/h)" -- Freitextantwort, schwer automatisch zu validieren. Als `textaufgabe`-Typ akzeptabel.
- #19 "Schnecke und Gepard": parsed.items[2].antwort = "2.000-mal schneller" -- enthält Einheit und Formatierung. Kind könnte "2000" eingeben.
- #29 "Wer kommt zuerst an?": Antworten enthalten umfangreiche Erklärungen ("1 Stunde (= 60 Minuten)", "27 Minuten (15 min Warten + 12 min Fahrt)"). Als `textaufgabe` akzeptabel, aber erschwert automatische Validierung.
- #57 "Strichliste in eine Tabelle übertragen": Die Strichliste zeigt "S | IIII |". In der deutschen Strichlisten-Konvention sind 4 senkrechte Striche ohne Querstrich = 4 Einheiten, mit Querstrich (dargestellt als 5-bar) = 5. Hier steht "IIII" (ohne Querstrich), aber die Lösung sagt S = 5. Die Darstellung ist mehrdeutig -- prüfen ob "IIII" im Rendering als 5-bar gemeint war. Falls S tatsächlich 4 sein sollte, ändert das auch die Antwort zu c) nicht (A+T = 3+9 = 12 = E bleibt gültig), aber a) wäre dann E:12, N:8, R:6, T:9, S:4, A:3.
