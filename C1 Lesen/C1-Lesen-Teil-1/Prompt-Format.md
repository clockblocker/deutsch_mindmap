Need help with converting the Goethe Lesen C1 Teil-1 to usable Obsidian markdown like this:

example_input:```
**5 Lesen Sie den unten stehenden Text und die Auswahlantworten. Welche grammatischen Strukturen stehen in den neun Lücken zur Auswahl? Notieren Sie die Nummer der Items.**

---

**Roboter als Unterwasser-Müllsammler**

Die Ozeane sind voller Plastikmüll. Um dagegen anzugehen, entwickeln Wissenschaftlerinnen und Wissenschaftler zurzeit ein Robotersystem, das Kunststoffabfälle unter Wasser orten und einsammeln kann.

Die Ozeane unseres Planeten sind voller Plastikmüll – zwischen 26 und 66 Millionen Tonnen größere und kleinere Kunststoffreste befinden sich Schätzungen **1 a gegenüber b halber c zufolge d zuliebe** im Meer. Ein Teil davon wird im Laufe der Zeit zu Mikroplastik zerrieben, gemeinsam mit größeren Resten sinkt dieser Müll allmählich in die Tiefe und lagert sich am Meeresboden ab. Für viele Tiere im Ozean sind die Plastikteile eine **2 a akute b damalige c frühere d zukünftige** Bedrohung, denn oft fressen sie sie irrtümlich und sterben daran.

Bisher konzentrierten sich die Reinigungsmaßnahmen vor allem auf Küsten und die Wasseroberfläche, **3 a aber b denn c nämlich d zumal** den Meeresboden zu säubern ist aufwendiger und für Taucher gefährlich. Deshalb entwickeln nun Wissenschaftlerinnen und Wissenschaftler der Technischen Universität München gemeinsam mit ausländischen Partner-Instituten ein System, **4 a dessen b die c von d welche** Aufgabe darin besteht, Müll unter Wasser einzusammeln.

Das System **5 a gehört b hängt c schließt d setzt** sich aus vier Roboter-Komponenten zusammen: Ein autonom fahrendes Roboter-Boot lokalisiert größere Müllansammlungen im Wasser. Dann wird ein Beobachtungsroboter ins Wasser gelassen, der Nahaufnahmen des Meeresbodens liefert. Bei guten Sichtverhältnissen sorgt zusätzlich eine Drohne aus der Luft **6 a dabei b dafür c dagegen d damit**, dass weiterer Müll im Wasser erkannt wird. Alle Informationen dieser „Müllspäher“ werden dann zu einer virtuellen Karte kombiniert. Diese dient einem Sammelroboter als Grundlage, der dann den Müll mithilfe eines Greifers in einen Sammelkorb legt.

**7 a Was b Wem c Wen d Wer** in der Theorie einfach klingt, ist in der Praxis für autonom agierende Roboter aber nicht einfach: Denn anders als an Land herrschen im Wasser ganz besondere Bedingungen. Sobald ein Stück Müll identifiziert und geortet wurde, muss sich der Roboter zunächst in dessen Nähe bewegen. **8 a Dabei b Deswegen c Infolgedessen d Sonst** kann er mitunter auf starke Strömungen treffen, gegen die er sich durchsetzen muss.

Bisher läuft die Entwicklung aber trotz dieser erhöhten Schwierigkeiten erfolgreich: Wenn das System **9 a ausgesprochen b besonders c sehr d voll** einsatzfähig ist, soll es Unterwasserabfälle mit einer Quote von 80 Prozent klassifizieren und zu 90 Prozent erfolgreich einsammeln. Die Roboter wären dann so effektiv wie menschliche Taucher.
```


example_output: ```
**Roboter als Unterwasser-Müllsammler**

Die Ozeane sind voller Plastikmüll. Um dagegen anzugehen, entwickeln Wissenschaftlerinnen und Wissenschaftler zurzeit ein Robotersystem, das Kunststoffabfälle unter Wasser orten und einsammeln kann.

Die Ozeane unseres Planeten sind voller Plastikmüll – zwischen 26 und 66 Millionen Tonnen größere und kleinere Kunststoffreste befinden sich Schätzungen [1] im Meer. Ein Teil davon wird im Laufe der Zeit zu Mikroplastik zerrieben, gemeinsam mit größeren Resten sinkt dieser Müll allmählich in die Tiefe und lagert sich am Meeresboden ab. Für viele Tiere im Ozean sind die Plastikteile eine [2] Bedrohung, denn oft fressen sie sie irrtümlich und sterben daran.

Bisher konzentrierten sich die Reinigungsmaßnahmen vor allem auf Küsten und die Wasseroberfläche, [3] den Meeresboden zu säubern ist aufwendiger und für Taucher gefährlich. Deshalb entwickeln nun Wissenschaftlerinnen und Wissenschaftler der Technischen Universität München gemeinsam mit ausländischen Partner-Instituten ein System, [4] Aufgabe darin besteht, Müll unter Wasser einzusammeln.

Das System [5] sich aus vier Roboter-Komponenten zusammen: Ein autonom fahrendes Roboter-Boot lokalisiert größere Müllansammlungen im Wasser. Dann wird ein Beobachtungsroboter ins Wasser gelassen, der Nahaufnahmen des Meeresbodens liefert. Bei guten Sichtverhältnissen sorgt zusätzlich eine Drohne aus der Luft [6], dass weiterer Müll im Wasser erkannt wird. Alle Informationen dieser „Müllspäher“ werden dann zu einer virtuellen Karte kombiniert. Diese dient einem Sammelroboter als Grundlage, der dann den Müll mithilfe eines Greifers in einen Sammelkorb legt.

[7] in der Theorie einfach klingt, ist in der Praxis für autonom agierende Roboter aber nicht einfach: Denn anders als an Land herrschen im Wasser ganz besondere Bedingungen. Sobald ein Stück Müll identifiziert und geortet wurde, muss sich der Roboter zunächst in dessen Nähe bewegen. [8] kann er mitunter auf starke Strömungen treffen, gegen die er sich durchsetzen muss.

Bisher läuft die Entwicklung aber trotz dieser erhöhten Schwierigkeiten erfolgreich: Wenn das System [9] einsatzfähig ist, soll es Unterwasserabfälle mit einer Quote von 80 Prozent klassifizieren und zu 90 Prozent erfolgreich einsammeln. Die Roboter wären dann so effektiv wie menschliche Taucher.

###### Antwortoptionen:
1) [[Lesen-Teil-1-Präposition]]
    a) gegenüber 
    b) halber 
    c) zufolge 
    d) zuliebe
2) [[Lesen-Teil-1-Adjektiv]]
    a) akute 
    b) damalige 
    c) frühere 
    d) zukünftige
3) [[Lesen-Teil-1-Konnektor]]
    a) aber 
    b) denn 
    c) nämlich 
    d) zumal
4) [[Lesen-Teil-1-Relativpronomen]]
    a) dessen 
    b) die 
    c) von 
    d) welche
5) [[Lesen-Teil-1-Trennbares-Verb]]
    a) gehört 
    b) hängt 
    c) schließt 
    d) setzt
6) [[Lesen-Teil-1-Präpositionalpronomen]]
    a) dabei 
    b) dafür 
    c) dagegen 
    d) damit
7) [[Lesen-Teil-1-W-Pronomen]]
    a) Was 
    b) Wem 
    c) Wen 
    d) Wer
8) [[Lesen-Teil-1-Verbindungsadverb]]
    a) Dabei 
    b) Deswegen 
    c) Infolgedessen 
    d) Sonst
9) [[Lesen-Teil-1-Steigerungsadverb]]
    a) ausgesprochen 
    b) besonders 
    c) sehr 
    d) voll
```

please follow the very specific format of the Antwortoptionen:
```
 {index}) [[{identified_grammar_type}]]
    {letter}) {option} 
```
use specifically it, do not use bold / italics / etc. mind the brackets. 

Please, process in the same format this text: 


Mit Erfolg = 0..
Mit Erfolg = 1..
prufungtraining 2..