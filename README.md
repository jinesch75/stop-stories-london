# Stop Stories · London

The hidden story behind the next station: a phone web app that explains, in a few lines, where the names of London's
Underground, Elizabeth line, London Overground and DLR stations come from. English, French and German.

An independent, non-commercial project. **Not** an official app of Transport for London (TfL).

## Made with AI

This app was made with **Claude, an AI model by [Anthropic](https://www.anthropic.com)**. Claude researched the
stations, wrote the station texts in English, translated them into French and German, wrote the quiz, designed the app
and wrote its code. Every text was then checked by separate Claude agents that had not written it, against the sources
below (results in `build/research/factcheck/`). The idea, the decisions and the final review are human. Anthropic is not
involved in this project. Commits made with Claude carry a `Co-Authored-By: Claude` line.

## Sources

Facts were taken from these public sources and written up in new texts; no text, image or map was copied.
In the app, every station links to the pages used for it under "Read more".

- **Wikipedia** (English): articles on each station and on the place, person or building it is named after; the
  [List of London Underground stations](https://en.wikipedia.org/wiki/List_of_London_Underground_stations) for opening years and former names.
- **Londonist**, "How the … line stations got their names" (one article per Underground line and the Elizabeth line):
  the main starting point for the Underground and Elizabeth line stories.
- **Royal Docks**, [How the Royal Docks' 12 DLR stations got their names](https://royaldocks.london/articles/how-the-royal-docks-12-dlr-stations-got-their-names).
- **A. D. Mills, *A Dictionary of London Place Names*** (Oxford University Press), through Wikipedia's summaries and Claude's general knowledge.
- Fact-check also used: [Hidden London](https://www.hidden-london.com), [British History Online](https://www.british-history.ac.uk),
  the Enfield Society, the Hornsey Historical Society, the Parish of Hornchurch and the Online Etymology Dictionary.
- **Network data**: [TfL Open Data](https://tfl.gov.uk/info-for/open-data-users/) (Unified API). Powered by TfL Open Data.
  Contains OS data © Crown copyright and database rights 2016 and Geomni UK Map data © and database rights 2019.

Explaining London's station names is not a new idea: Londonist's series and books such as Cyril M. Harris's
*What's in a Name?* did it long before. Stop Stories adds the format: one short story per station, in line order, in three languages.

Line names and colours belong to TfL and are used only to identify the lines; no TfL logo is used. Fonts: Atkinson
Hyperlegible, Big Shoulders, IBM Plex Mono (SIL Open Font License, via Google Fonts). Icons and flags were drawn for this app.

## Technical

See [BUILD.md](BUILD.md). Feedback: jacquesbrosius@hotmail.com.
