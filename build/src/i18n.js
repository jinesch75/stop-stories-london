// ── Languages ───────────────────────────────────────────────────────────
const LANGS = ["en","fr","de"];
const LANG_READY = true;
const UI = {
en:{
  brand:"London", tagline:"The hidden story behind the next station in London",
  choose:"Choose your line.", lineName:"{n} line", mode_tube:"Underground", mode_elizabeth:"Elizabeth line", mode_overground:"London Overground", mode_dlr:"DLR",
  nearMe:"Stations near me",
  locating:"Finding your location…", locDenied:"Location is turned off for this site. You can allow it in your phone's settings.",
  locFail:"Your location could not be found. Please try again.", locFar:"No station within 2 km.",
  locUnsupported:"This browser cannot share your location.",
  nearest:"Nearest stations", onLines:"Lines", playBtn:"Play the quiz", gameTitle:"Stop Stories Quiz", gameIntro:"Five questions about the stories behind the names of London's stations. There is no timer, so take your time.", gameStart:"Start", gameBack:"Back to the quiz", gameBest:"Your best score: {n} out of 5", gameQ:"Question {i} of {n}", gameScoreLabel:"Score", gameGuess:"Guess the station", gameQuiz:"Quiz", gameRight:"Correct!", gameWrong:"Not quite.", gameAnswerWas:"The answer is: {a}.", gameRead:"Read the story", gameNext:"Next question", gameSeeScore:"See your score", gameScore:"{n} out of {t}", gameMsg0:"Every station has a story. Try another round!", gameMsg2:"Well done! You are getting to know London.", gameMsg4:"Excellent! You know your stations.", gameMsg5:"Perfect score!", gameAgain:"Play again", gameStops:"The stations in this round", nearShort:"Stations near me", locPrivacy:"Your location is only used on your phone and is never sent anywhere.",
  aboutShort:"About", contact:"Contact",
  lineTowards:"{l} · towards", dir:"Direction of travel",
  listHint:"Tap a station to discover the story behind its name.",
  lastRead:"Last read", stopOf:"Station {n} of {m}",
  prevStop:"Previous station: {x}", nextStop:"Next station: {x}", firstStop:"First station", endLine:"End of the line",
  route:"Route", routes:"{n} routes on this line", changeRoute:"Change route", chooseRoute:"Choose your route", via:"via {x}", stationsN:"{n} stations",
  readMore:"Read more", improve:"Help us improve", linksNote:"Links open in a new tab.",
  wrong:"What is wrong?", issues:["Wrong fact","Typo","Unclear","Missing info","Broken link","Wrong station","Other"],
  comment:"Your comment", commentPh:"E.g. the station opened in another year, here is the source…",
  err:"Choose an issue or write a comment.", send:"Send by email", sendHint:"Opens your email app, addressed to {e}.",
  thanks:"Thank you", mailIntro:"Your email app should open with your message. Just press Send there.",
  byHand:"Nothing opened? Do it by hand:", step1:"Copy the message below.", step2:"Open your email app and write a new email to",
  copyAddr:"Copy address", addrCopied:"Address copied", selectAbove:"Select it above",
  step3:"Paste your message and send it. Thank you!", copyMsg:"Copy message", copied:"Copied", selected:"Selected, press Copy",
  done:"Done", close:"Close", back:"Back", stopWord:"station", m:"m", km:"km", language:"Language", swap:"Switch direction", noStory:"We haven't found the story behind this name yet.", fromL:"From:", toL:"To:"
},
fr:{
  brand:"Londres", tagline:"L'histoire cachée derrière la prochaine station à Londres",
  choose:"Choisissez votre ligne.", lineName:"ligne {n}", mode_tube:"Métro (Underground)", mode_elizabeth:"Elizabeth line", mode_overground:"London Overground", mode_dlr:"DLR",
  nearMe:"Stations près de moi",
  locating:"Recherche de votre position…", locDenied:"La localisation est désactivée pour ce site. Vous pouvez l'autoriser dans les réglages de votre téléphone.",
  locFail:"Votre position n'a pas pu être trouvée. Veuillez réessayer.", locFar:"Aucune station à moins de 2 km.",
  locUnsupported:"Ce navigateur ne peut pas partager votre position.",
  nearest:"Stations les plus proches", onLines:"Lignes", playBtn:"Jouer au quiz", gameTitle:"Le quiz Stop Stories", gameIntro:"Cinq questions sur les histoires cachées derrière les noms des stations de Londres. Pas de chrono : prenez votre temps.", gameStart:"Commencer", gameBack:"Retour au quiz", gameBest:"Votre meilleur score : {n} sur 5", gameQ:"Question {i} sur {n}", gameScoreLabel:"Score", gameGuess:"Devinez la station", gameQuiz:"Quiz", gameRight:"Bonne réponse !", gameWrong:"Pas tout à fait.", gameAnswerWas:"La bonne réponse : {a}.", gameRead:"Lire l'histoire", gameNext:"Question suivante", gameSeeScore:"Voir le score", gameScore:"{n} sur {t}", gameMsg0:"Chaque station a son histoire. Essayez encore une partie !", gameMsg2:"Bravo ! Vous apprenez à connaître Londres.", gameMsg4:"Excellent ! Vous connaissez vos stations.", gameMsg5:"Score parfait !", gameAgain:"Rejouer", gameStops:"Les stations de cette partie", nearShort:"Près de moi", locPrivacy:"Votre position n'est utilisée que sur votre téléphone et n'est jamais transmise.",
  aboutShort:"À propos", contact:"Contact",
  lineTowards:"{l} · direction", dir:"Sens du trajet",
  listHint:"Touchez une station pour découvrir l'histoire de son nom.",
  lastRead:"Lu en dernier", stopOf:"Station {n} sur {m}",
  prevStop:"Station précédente : {x}", nextStop:"Station suivante : {x}", firstStop:"Première station", endLine:"Terminus",
  route:"Itinéraire", routes:"{n} itinéraires sur cette ligne", changeRoute:"Changer d'itinéraire", chooseRoute:"Choisissez votre itinéraire", via:"via {x}", stationsN:"{n} stations",
  readMore:"En savoir plus", improve:"Une erreur ?", linksNote:"Les liens s'ouvrent dans un nouvel onglet.",
  wrong:"Qu'est-ce qui ne va pas ?", issues:["Fait erroné","Faute de frappe","Pas clair","Info manquante","Lien cassé","Mauvaise station","Autre"],
  comment:"Votre commentaire", commentPh:"Par ex. la station a ouvert une autre année, voici la source…",
  err:"Choisissez un problème ou écrivez un commentaire.", send:"Envoyer par e-mail", sendHint:"Ouvre votre application e-mail, avec l'adresse {e}.",
  thanks:"Merci", mailIntro:"Votre application e-mail devrait s'ouvrir avec votre message. Il suffit d'appuyer sur Envoyer.",
  byHand:"Rien ne s'est ouvert ? Faites-le à la main :", step1:"Copiez le message ci-dessous.", step2:"Ouvrez votre application e-mail et écrivez un nouvel e-mail à",
  copyAddr:"Copier l'adresse", addrCopied:"Adresse copiée", selectAbove:"Sélectionnez-la ci-dessus",
  step3:"Collez votre message et envoyez-le. Merci !", copyMsg:"Copier le message", copied:"Copié", selected:"Sélectionné, appuyez sur Copier",
  done:"Terminé", close:"Fermer", back:"Retour", stopWord:"station", m:"m", km:"km", language:"Langue", swap:"Inverser le sens", noStory:"Nous n'avons pas encore trouvé l'histoire de ce nom.", fromL:"De :", toL:"Vers :"
},
de:{
  brand:"London", tagline:"Die verborgene Geschichte hinter der nächsten Station in London",
  choose:"Wählen Sie Ihre Linie.", lineName:"{n} Line", mode_tube:"U-Bahn (Underground)", mode_elizabeth:"Elizabeth line", mode_overground:"London Overground", mode_dlr:"DLR",
  nearMe:"Stationen in meiner Nähe",
  locating:"Standort wird gesucht…", locDenied:"Die Standortfreigabe ist für diese Seite ausgeschaltet. Sie können sie in den Einstellungen Ihres Telefons erlauben.",
  locFail:"Ihr Standort konnte nicht ermittelt werden. Bitte versuchen Sie es erneut.", locFar:"Keine Station im Umkreis von 2 km.",
  locUnsupported:"Dieser Browser kann Ihren Standort nicht teilen.",
  nearest:"Nächste Stationen", onLines:"Linien", playBtn:"Quiz spielen", gameTitle:"Das Stop-Stories-Quiz", gameIntro:"Fünf Fragen zu den Geschichten hinter den Namen der Londoner Stationen. Ohne Zeitlimit, lassen Sie sich Zeit.", gameStart:"Los geht's", gameBack:"Zurück zum Quiz", gameBest:"Ihr bestes Ergebnis: {n} von 5", gameQ:"Frage {i} von {n}", gameScoreLabel:"Punkte", gameGuess:"Welche Station?", gameQuiz:"Quiz", gameRight:"Richtig!", gameWrong:"Nicht ganz.", gameAnswerWas:"Richtig ist: {a}.", gameRead:"Zur Geschichte", gameNext:"Nächste Frage", gameSeeScore:"Zum Ergebnis", gameScore:"{n} von {t}", gameMsg0:"Jede Station hat eine Geschichte. Versuchen Sie noch eine Runde!", gameMsg2:"Gut gemacht! Sie lernen London kennen.", gameMsg4:"Ausgezeichnet! Sie kennen Ihre Stationen.", gameMsg5:"Volle Punktzahl!", gameAgain:"Noch einmal", gameStops:"Die Stationen dieser Runde", nearShort:"In meiner Nähe", locPrivacy:"Ihr Standort wird nur auf Ihrem Telefon verwendet und nie weitergegeben.",
  aboutShort:"Über uns", contact:"Kontakt",
  lineTowards:"{l} · Richtung", dir:"Fahrtrichtung",
  listHint:"Tippen Sie auf eine Station, um die Geschichte hinter ihrem Namen zu entdecken.",
  lastRead:"Zuletzt gelesen", stopOf:"Station {n} von {m}",
  prevStop:"Vorherige Station: {x}", nextStop:"Nächste Station: {x}", firstStop:"Erste Station", endLine:"Endstation",
  route:"Strecke", routes:"{n} Strecken auf dieser Linie", changeRoute:"Strecke wechseln", chooseRoute:"Wählen Sie Ihre Strecke", via:"über {x}", stationsN:"{n} Stationen",
  readMore:"Mehr erfahren", improve:"Fehler melden", linksNote:"Links öffnen sich in einem neuen Tab.",
  wrong:"Was stimmt nicht?", issues:["Falsche Angabe","Tippfehler","Unklar","Info fehlt","Link defekt","Falsche Station","Sonstiges"],
  comment:"Ihr Kommentar", commentPh:"Z. B. die Station wurde in einem anderen Jahr eröffnet, hier ist die Quelle…",
  err:"Wählen Sie ein Problem oder schreiben Sie einen Kommentar.", send:"Per E-Mail senden", sendHint:"Öffnet Ihre E-Mail-App, adressiert an {e}.",
  thanks:"Danke", mailIntro:"Ihre E-Mail-App sollte sich mit Ihrer Nachricht öffnen. Tippen Sie dort einfach auf Senden.",
  byHand:"Nichts geöffnet? So geht es von Hand:", step1:"Kopieren Sie die Nachricht unten.", step2:"Öffnen Sie Ihre E-Mail-App und schreiben Sie eine neue E-Mail an",
  copyAddr:"Adresse kopieren", addrCopied:"Adresse kopiert", selectAbove:"Oben markieren",
  step3:"Fügen Sie Ihre Nachricht ein und senden Sie sie. Danke!", copyMsg:"Nachricht kopieren", copied:"Kopiert", selected:"Markiert, jetzt kopieren",
  done:"Fertig", close:"Schließen", back:"Zurück", stopWord:"Station", m:"m", km:"km", language:"Sprache", swap:"Richtung wechseln", noStory:"Die Geschichte hinter diesem Namen haben wir noch nicht gefunden.", fromL:"Von:", toL:"Nach:"
}};
let LANG = !LANG_READY ? "en" : (() => { const s = store("lang"); if (LANGS.includes(s)) return s;
  const n = (navigator.language || "en").slice(0,2).toLowerCase(); return LANGS.includes(n) ? n : "en"; })();
const t = (k, vars) => { let v = (UI[LANG] && UI[LANG][k] !== undefined) ? UI[LANG][k] : UI.en[k];
  if (vars && typeof v === "string") for (const [a,b] of Object.entries(vars)) v = v.split("{"+a+"}").join(b);
  return v; };
// station texts: English in STOPS, French and German in TR
const sHead = s => (LANG !== "en" && TR[LANG] && TR[LANG][s.key]) ? TR[LANG][s.key][0] : s.head;
const sText = s => (LANG !== "en" && TR[LANG] && TR[LANG][s.key]) ? TR[LANG][s.key][1] : s.text;
for (const [k, s] of Object.entries(STOPS)) s.key = k;
function setLang(l){ LANG = l; store("lang", l); document.documentElement.lang = l; route(); }
document.documentElement.lang = LANG;
