# Audit: 11-sachrechnen.json
Geprueft: 30 Aufgaben (keine Platzhalter)

## Fehler
Keine mathematischen Fehler gefunden. Alle Rechenwerte sind korrekt.

## Warnungen
- #0 "Eintrittspreise vergleichen": Teilaufgabe c) fragt "Welches Angebot ist fuer Jette guenstiger?" und erwartet "Einzeltickets" als Freitext. Ein Kind koennte "die Einzeltickets", "8 einzelne Tickets" o.ae. schreiben. Besser als Auswahl-Aufgabe (Einzeltickets / 10er-Karte).
- #11 "Sachhuepfen -- Wer ist zuerst im Ziel?": Antwort ist Freitext "Ali". Gross-/Kleinschreibung oder alternative Formulierungen ("Ali ist schneller", "der Sohn") koennten Probleme machen. Besser als Auswahl-Aufgabe (Ali / Vater).
- #26 "Getraenkestand auf dem Schulfest": Mehrere parsed-Schrittantworten enthalten Text mit Einheit ("0 Euro", "16 Euro", "30 Euro", "54 Euro", "84 Euro"). Das ist inkonsistent mit dem ueblichen Eingabe-Format (reine Zahlen). Ein Kind, das nur "16" eingibt, wuerde bei "16 Euro" als falsch gewertet.
- #27 "Rechenkette -- Wandertag": Parsed-Antworten "2.000", "2.650", "3.600", "5.000" verwenden Punkte als Tausendertrennzeichen. Falls der Validator nur exakte Uebereinstimmung prueft, wuerde die Eingabe "2000" (ohne Punkt) als falsch gewertet.
