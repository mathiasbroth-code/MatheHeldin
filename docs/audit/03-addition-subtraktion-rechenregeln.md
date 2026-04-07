# Audit: 03-addition-subtraktion-rechenregeln.json
Geprüft: 72 Aufgaben (ohne 1 Platzhalter: #54 "Platzhalter in Ungleichungen finden")

---

## Fehler

Keine mathematischen Rechenfehler in den `loesung`- oder `antwort`-Feldern gefunden.

---

## Warnungen

- **#8** "Schriftliches Subtrahieren mit großen Zahlen": Im `loesungsweg` steht `Z: 7 − 6 = 1` — die Ziffer an der Zehnerstelle von 5.483 ist **8**, nicht 7. Die korrekte Rechnung wird in der Klammer nachgeliefert (`8 − 1 − 6 = 1`), aber der Text ist missverständlich. Die `antwort` (3.316) ist rechnerisch korrekt.

- **#7** "Fünfstellige Zahlen bilden und subtrahieren": Die `aufgabenstellung` verlangt **mindestens zwei** Möglichkeiten. Das `parsed.items[0].antwort` zeigt aber nur ein einziges Beispiel (`100.000 − 64.815 = 35.185`). Für die digitale Auswertung muss entweder das Antwortfeld erweitert oder die Aufgabe als offene Freitext-Eingabe behandelt werden.

- **#22** "Einkaufsliste mit Budget planen": Die `aufgabenstellung` fordert eine Kombination, die **möglichst nahe an 1.500 Euro** herankommt. Das `parsed.items[0].antwort` zeigt nur 634,90 € — das ist nicht „möglichst nah" und widerspricht der Aufgabenstellung. Der `loesungsweg` enthält die bessere Lösung (~1.493,80 €). Das `parsed.antwort`-Feld sollte auf diese bessere Lösung zeigen oder zumindest darauf hinweisen, dass die Suche nach dem Maximum gemeint ist.

---

## Notizen (keine Fehler, aber beachtenswert)

- Alle Rechenpäckchen (#0–#2), alle ANNA/NANA-Aufgaben (#13–#17), alle Gleichungs- und Ungleichungsaufgaben (#48–#54), alle wahr-falsch-Prüfaufgaben und alle Rechenketten/Zahlenrätsel wurden einzeln nachgerechnet — keine Fehler.

- Typ-Passung: Alle `typ`-Felder passen zum jeweiligen Aufgabenformat (eingabe, luecke, wahr-falsch, zuordnung, auswahl, textaufgabe, schritt).

- Tipps-Qualität: Die Vierer-Staffel (Impuls → Denkanstoß → Teilantwort → Lösung) ist durchgehend eingehalten. Tipp 4 gibt jeweils die vollständige Lösung. Sprache ist durchgehend kindgerecht und nicht verletzend.

- Antwort-Format: Einfache Zahleneingaben (eingabe, luecke) sind mit klaren Zahlenwerten belegt. Bei textaufgabe-Typen steht im `antwort`-Feld stets ein Erklärungstext — das ist für offene Aufgaben korrekt, aber die Lern-App muss damit umgehen können (freie Texteingabe oder Anzeige der Musterlösung).
