# Audit: 06-gewichte-laengen-skizzen.json
Geprueft: 35 Aufgaben (ohne Platzhalter)

## Fehler
Keine mathematischen Fehler gefunden. Alle 35 Aufgaben sind rechnerisch korrekt.

Der im vorherigen Audit gemeldete Fehler (#19 Radfahrer-Antwort "4" statt "16") ist behoben. Der Wert ist jetzt korrekt "16".

Stichproben-Verifikation:
- Tonnen/kg: 3,005 t = 3.005 kg, 8.375 kg = 8,375 t, 2 t 345 kg = 2.345 kg
- Fahrzeuge: 720+180=900, 8200+3800=12000, 14700-6150=8550
- Bruecke: 10800+3x1450=15150 < 16000, 20000-12500=7500, 7500/1800=4 Rest 300
- Tiere: 600x7=4200, 6500/600=10.83 -> 11, 2500000/800=3125
- Entfernungen: 4.8+6.3+5.2+7.1=23.4, 8.5+12.3+9.7+15.2+6.8=52.5, 52.5/3=17.5
- Geschwindigkeit: 60/15=4, 8x2=16, 12x4=48, 9000/50=180
- Skizzen: 13-3.5-5=4.5, 19.4/2=9.7, 9.7-5.2-3.1=1.4, 24.5-4.2-2.5-10.3=7.5
- Tunnel: 3+4.5=7.5/Tag, 1500/7.5=200, 200x3=600, 200x4.5=900
- Gartenzaun: 2x7+2x3=20, 20-1=19, 22-19=3 uebrig
- Holzleiste: 200/50=4 Stuecke (3 Schnitte), 300/5=60 Stuecke (59 Schnitte)

## Warnungen

### Antwort-Format

- #8 "Futterbedarf im Zoo berechnen": Items b) und c) haben `antwort` mit Einheit und Punkt ("1.800", "4.200"), Item a) hat "600". Inkonsistentes Format -- Einheit sollte aus antwort entfernt werden fuer Eingabe-Validierung.

- #9 "Tiervergleich -- Wie viele Tiere wiegen so viel wie...?": Item a) `antwort = "11"` ist korrekt, aber die `loesung` sagt "ungefaehr 11 Pferde" -- das Wort "ungefaehr" fehlt im parsed-Antwort. Fuer ein Kind unklar, ob 10 oder 11 akzeptiert wird.

- #14 "Restliche Strecke berechnen": Item c) `antwort = "Ja, 6,5 km < 8 km."` -- Erklaerungstext statt einfaches "Ja". Die anderen Items (a, b) haben reine Zahlwerte.

- #23 "Skizze -- Gartenzaun und Gemuesebeet": `antwort` ist ein ganzer Absatz ("Ja, der Zaun reicht. Der Umfang ohne Tor ist: ..."). Sollte "Ja" sein, der Rest gehoert in loesungsweg.

- #26 "Skizze -- Tunnelbau von zwei Seiten": Item a) `antwort = "200 Tage"` (Einheit im Wert), Item b) `antwort = "Firma 1: 600 m, Firma 2: 900 m"` -- zusammengesetzte Antwort mit zwei Werten. Schwer eingebbar und validierbar.

- #27 "Skizze -- Holzleiste zersaegen": Items haben zusammengesetzte Antworten ("4 Stuecke, 3 Schnitte" und "60 Stuecke, 59 Schnitte"). Zwei Werte pro Feld, schwer digital eingebbar. Besser als zwei separate Items pro Teilaufgabe.

### Tipps-Qualitaet

- Alle Aufgaben haben 4 Tipps, die aufbauend strukturiert sind (Impuls -> Denkansatz -> Teilantwort -> vollstaendige Loesung). Sprache ist durchgehend kindgerecht.
