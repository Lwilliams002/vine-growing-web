import type { Bilingual } from "./i18n";

export type ScriptureRef = { label: string; query: string };

export type Belief = {
  n: number;
  title: Bilingual;
  paragraphs: { es: string[]; en: string[] };
  scripture: { es: ScriptureRef[]; en: ScriptureRef[] };
};

export const BELIEFS_SOURCE = {
  name: {
    es: "Asamblea Apostólica de la Fe en Cristo Jesús",
    en: "Apostolic Assembly of the Faith in Christ Jesus",
  },
  url: { es: "https://aaofcj.com/en-que-creemos/", en: "https://aaofcj.com/what-we-believe/" },
} as const;

// Doctrinal principles of the Apostolic Assembly of the Faith in Christ Jesus,
// reproduced word for word from the organization's site (both languages are
// their official texts). Scripture references were moved out of the paragraphs
// into `scripture` so they can be shown as sources.
export const BELIEFS: readonly Belief[] = [
  {
    n: 1,
    title: { es: "La Biblia", en: "The Word of God" },
    paragraphs: {
      es: [
        "“Edificados sobre el fundamento de los apóstoles y profetas, siendo la principal piedra del ángulo Jesucristo mismo,”. La Asamblea Apostólica desde sus inicios ha creído que “nuestro credo y disciplina, dirección, orden y doctrina están en la palabra de Dios”. Creemos que la palabra de Dios, La Biblia, es divinamente inspirada, y perfecta, y que ella es nuestra máxima y final autoridad.",
        "Creemos que los 66 libros de la Santa Biblia, desde el Génesis hasta el Apocalipsis, son el canon completo de las sagradas escrituras. Creemos que Dios preserva su palabra a través de los siglos para la salvación y edificación de su iglesia en todo el mundo. “Dios habiendo hablado muchas veces y en muchas maneras en otro tiempo a los padres por los profetas, en estos postreros días nos ha hablado por el hijo, a quien constituyó heredero de todo por quien asimismo hizo el universo,”.",
      ],
      en: [
        "“Having been built on the foundation of the apostles and prophets, Jesus Christ Himself being the chief cornerstone”. The Apostolic Assembly since its inception has believed that “our creed and discipline, direction, order and doctrine are in the Word of God”. We believe that the Word of God, the Bible, is divinely inspired, perfect, and that it is our highest and final authority.",
        "We believe that the sacred scriptures, the 66 books, from Genesis to Revelation, are the complete canon. We believe that God preserves his Word through the centuries for the salvation and edification of His church in the whole world. “God, who at various times and in various ways spoke in time past to the fathers by the prophets, has in these last days spoken to us by His son, whom He has appointed heir of all things, through whom also He made the worlds.",
      ],
    },
    scripture: {
      es: [
        { label: "Efesios 2:20", query: "Ephesians 2:20" },
        { label: "2 Timoteo 3:16", query: "2 Timothy 3:16" },
        { label: "2 Pedro 1:20-21", query: "2 Peter 1:20-21" },
        { label: "Salmo 19:7", query: "Psalm 19:7" },
        { label: "Mateo 24:35", query: "Matthew 24:35" },
        { label: "Salmo 119:89", query: "Psalm 119:89" },
        { label: "Romanos 3:4", query: "Romans 3:4" },
        { label: "Hebreos 1:1-2", query: "Hebrews 1:1-2" },
      ],
      en: [
        { label: "Ephesians 2:20", query: "Ephesians 2:20" },
        { label: "2 Timothy 3:16", query: "2 Timothy 3:16" },
        { label: "2 Peter 1:20-21", query: "2 Peter 1:20-21" },
        { label: "Psalm 19:7", query: "Psalm 19:7" },
        { label: "Matthew 24:35", query: "Matthew 24:35" },
        { label: "Psalm 119:89", query: "Psalm 119:89" },
        { label: "Romans 3:4", query: "Romans 3:4" },
        { label: "Hebrews 1:1-2", query: "Hebrews 1:1-2" },
      ],
    },
  },
  {
    n: 2,
    title: { es: "La Iglesia", en: "The Church" },
    paragraphs: {
      es: [
        "Creemos que la Iglesia de nuestro Señor Jesucristo es una, universal e indivisible, formada por todos los hombres, sin distinción de nacionalidad, idioma, color o costumbres, que hayan aceptado a nuestro Señor Jesucristo como su Salvador y hayan sido bautizados en el cuerpo por el Espíritu Santo. Los vínculos que unen a los miembros de la Iglesia son el amor y la fe común y su estandarte o bandera es el Nombre de Jesucristo, ante cuyo emblema marcha gallardamente la Iglesia, imponente como ejércitos en orden.",
      ],
      en: [
        "We believe that the Church of the Lord Jesus Christ is one, universal and indivisible, and composed of all men regardless of nationality, language, race or custom, who have accepted our Lord Jesus Christ as their Savior and have been baptized into His Body by the Holy Spirit. The bonds of a common faith and love unite the members of the Church. The flag or banner of the Church is the Name of Jesus Christ whose emblem the Church marches gallantly as an army on parade.",
      ],
    },
    scripture: {
      es: [
        { label: "1 Corintios 12:13", query: "1 Corinthians 12:13" },
        { label: "Cantares 6:10", query: "Song of Solomon 6:10" },
      ],
      en: [
        { label: "1 Corinthians 12:13", query: "1 Corinthians 12:13" },
        { label: "Song of Solomon 6:10", query: "Song of Solomon 6:10" },
      ],
    },
  },
  {
    n: 3,
    title: { es: "Hay un Solo Dios", en: "There Is Only One God" },
    paragraphs: {
      es: [
        "Creemos que hay un sólo Dios que se ha manifestado al mundo en distintas formas a través de las edades y que especialmente se ha revelado como Padre en la Creación del Universo, como Hijo en la Redención de la humanidad, y como Espíritu Santo derramándose en los corazones de los creyentes.",
        "Este Dios es el Creador de todo lo que existe, sea visible o invisible. Es eterno, Infinito en poder, Santo en su naturaleza, atributos y propósitos. El posee una Divinidad absoluta e indivisible; es Infinito en su Inmensidad, Inconcebible en su modo de ser e Indescriptible en su Esencia; conocido completamente sólo por sí mismo, porque una mente infinita solo se puede comprender por sí misma. No tiene cuerpo ni partes y por tanto está libre de todas las limitaciones.",
        "El primer mandamiento de todos es: “Oye, Israel; el Señor nuestro Dios, el Señor uno es”. “Para nosotros, sin embargo, sólo hay un Dios…”.",
      ],
      en: [
        "We believe there is only one God who has manifested Himself to the world in various forms throughout the ages. He has specially revealed Himself as Father in the creation of the universe, as Son in the redemption of humanity, and as the Holy Spirit pouring out in the hearts of believers.",
        "This God is the Creator of everything that exists, whether visible or invisible. He is eternal, infinite in power, and Holy in His nature, attributes, and purpose. He possesses an absolute and indivisible divinity. He is infinite in His immensity, inconceivable in His way of being, and indescribable in essence. Since an infinite mind can only be comprehended by itself, no one can completely know Him but Himself. He has neither body nor parts; therefore, He is free of any limitations.",
        "The first commandment of all is, “Hear, O Israel: The Lord our God is one Lord”. “But to us, there is but one God…”.",
      ],
    },
    scripture: {
      es: [
        { label: "Marcos 12:29", query: "Mark 12:29" },
        { label: "Deuteronomio 6:4", query: "Deuteronomy 6:4" },
        { label: "1 Corintios 8:6", query: "1 Corinthians 8:6" },
      ],
      en: [
        { label: "Mark 12:29", query: "Mark 12:29" },
        { label: "Deuteronomy 6:4", query: "Deuteronomy 6:4" },
        { label: "1 Corinthians 8:6", query: "1 Corinthians 8:6" },
      ],
    },
  },
  {
    n: 4,
    title: { es: "Jesucristo", en: "Jesus Christ" },
    paragraphs: {
      es: [
        "Creemos que Jesucristo nació milagrosamente del vientre de la virgen María, por obra del Espíritu Santo y que al mismo tiempo es el único y verdadero Dios. El mismo Dios del Antiguo Testamento tomó forma humana. “Y aquel Verbo fue hecho carne, y habitó entre nosotros…”. “E indiscutiblemente, grande es el misterio de la piedad: Dios fue manifestado en carne, justificado en el Espíritu, visto de los ángeles, predicado a los gentiles, creído en el mundo, recibido arriba en gloria”.",
        "Creemos que en Jesucristo se mezclaron en una forma perfecta e incomprensible los atributos divinos y la naturaleza humana. Se llama el Hijo del Hombre porque Él nació de la Virgen María en cuyo vientre tomó forma de hombre, y adquirió así su naturaleza humana. Se llama el Hijo de Dios porque fue engendrado del Espíritu Santo y participó así de la naturaleza divina. Él era humano a través de María, en cuyo vientre tomó la forma de hombre. Él es divino por medio del Espíritu Santo quien engendró a María. Así, se llama el Hijo de Dios e Hijo del Hombre.",
        "Por tanto creemos que Jesucristo es Dios “Porque en él habita corporalmente toda la plenitud de la Deidad”,. Y creemos que la Biblia da a conocer todos sus atributos. Es Padre Eterno, a la vez es un niño que nos es nacido. Es Creador de todo. Es Omnipresente. Hacía maravillas como Dios Todopoderoso. Tiene potestad sobre el mar. Es el mismo siempre.",
      ],
      en: [
        "We believe that the Lord Jesus Christ was born miraculously from the womb of the Virgin Mary through the work of the Holy Spirit, and He is, at the same time, the One and only true God. The God of the Old Testament took upon Himself human form. “And the Word was made flesh and dwelt among us…”. “And without controversy great is the mystery of godliness: God was manifest in the flesh, justified in the Spirit, seen of angels, preached unto the Gentiles, believed on in the world, received up into glory.”",
        "We believe that in Jesus Christ, God’s divine attributes and human nature were combined in a perfect and incomprehensible form. He is called the Son of Man because He was born of the Virgin Mary in whose womb He took the form of man, and thus acquired His human nature. He is called the Son of God because He was begotten of the Holy Spirit and thus partook of the Divine nature. He was human through Mary, in whose womb He took the form of man. He was divine through the Holy Spirit who fathered Him in Mary. Thus, He is called the Son of God and Son of man. Therefore, we believe that Jesus Christ is God “For in him dwelleth all the fullness of the Godhead bodily.” We also believe that the Bible makes known all His attributes. He is the everlasting Father and, at the same time, a child born unto us.",
        "He is the Creator of all things. He is Omnipresent. He performed wonders as the Almighty God. He has power over the seas. He is always the same.",
      ],
    },
    scripture: {
      es: [
        { label: "Romanos 9:5", query: "Romans 9:5" },
        { label: "1 Juan 5:20", query: "1 John 5:20" },
        { label: "Isaías 60:1-3", query: "Isaiah 60:1-3" },
        { label: "Juan 1:14", query: "John 1:14" },
        { label: "1 Timoteo 3:16", query: "1 Timothy 3:16" },
        { label: "Colosenses 2:9", query: "Colossians 2:9" },
        { label: "Isaías 9:6", query: "Isaiah 9:6" },
        { label: "Colosenses 1:16-17", query: "Colossians 1:16-17" },
        { label: "Isaías 45:18", query: "Isaiah 45:18" },
        { label: "Juan 3:13", query: "John 3:13" },
        { label: "Deuteronomio 4:39", query: "Deuteronomy 4:39" },
        { label: "Lucas 5:24-26", query: "Luke 5:24-26" },
        { label: "Salmos 86:10", query: "Psalms 86:10" },
        { label: "Marcos 4:37-39", query: "Mark 4:37-39" },
        { label: "Salmos 107:29-30", query: "Psalms 107:29-30" },
        { label: "Hebreos 13:8", query: "Hebrews 13:8" },
        { label: "Salmos 102:27", query: "Psalms 102:27" },
      ],
      en: [
        { label: "Romans 9:5", query: "Romans 9:5" },
        { label: "1 John 5:20", query: "1 John 5:20" },
        { label: "Isaiah 60:1-3", query: "Isaiah 60:1-3" },
        { label: "John 1:14", query: "John 1:14" },
        { label: "1 Timothy 3:16", query: "1 Timothy 3:16" },
        { label: "Colossians 2:9", query: "Colossians 2:9" },
        { label: "Isaiah 9:6", query: "Isaiah 9:6" },
        { label: "Colossians 1:16-17", query: "Colossians 1:16-17" },
        { label: "Isaiah 45:18", query: "Isaiah 45:18" },
        { label: "John 3:13", query: "John 3:13" },
        { label: "Deuteronomy 4:39", query: "Deuteronomy 4:39" },
        { label: "Luke 5:24-26", query: "Luke 5:24-26" },
        { label: "Psalms 86:10", query: "Psalms 86:10" },
        { label: "Mark 4:37-39", query: "Mark 4:37-39" },
        { label: "Psalms 107:29-30", query: "Psalms 107:29-30" },
        { label: "Hebrews 13:8", query: "Hebrews 13:8" },
        { label: "Psalms 102:27", query: "Psalms 102:27" },
      ],
    },
  },
  {
    n: 5,
    title: { es: "El Espíritu Santo", en: "The Holy Spirit" },
    paragraphs: {
      es: [
        "Creemos en el bautismo del Espíritu Santo, prometido por Dios en el Antiguo Testamento y derramado después de la glorificación del Señor Jesucristo, que es quien lo envía.",
        "Creemos, además, que la demostración de que una persona ha sido bautizada con el Espíritu Santo son las nuevas lenguas o idiomas en que el creyente puede hablar y que esta señal es también para nuestro tiempo.",
        "Creemos también que el Espíritu Santo es potencia que permite testificar de Cristo y que sirve para la formación de un carácter cristiano más agradable a Dios. El mismo Espíritu da dones a los hombres, que sirven para la edificación de la Iglesia. No aceptamos que haya en ningún hombre la facultad de impartir a otro algún don, pues “todas estas cosas las hace uno y el mismo Espíritu, repartiendo a cada uno en particular como él quiere.” “Pero a cada uno de nosotros fue dada la gracia conforme a la medida del don de Cristo”.",
        "Todos los miembros de la Asamblea Apostólica de la Fe en Cristo Jesús deben buscar el Espíritu Santo y tratar de vivir constantemente en el Espíritu, como lo recomienda Romanos 8:5-16; Efesios 5:18; Colosenses 3:5.",
      ],
      en: [
        "We believe in the baptism of the Holy Spirit as promised by God in the Old Testament and as poured out after the glorification of our Lord Jesus Christ, who sends it.",
        "Furthermore, we believe that the demonstration that the person has been baptized with the Holy Spirit are the new tongues or languages in which the believer can speak. And this sign applies also in our time.",
        "We also believe that the Holy Spirit is power that enables us to testify of Christ. The Holy Spirit helps us develop a Christian character more pleasing to God. The same Spirit endows men with gifts for the edification of the Church. We do not believe that any man has the power to impart the gifts of God, “But all these worketh that one and the selfsame Spirit, dividing to every man severally as he will.” “But unto every one of us is given grace according to the measure of the gift of Christ.”",
        "All members of the Apostolic Assembly must seek the Holy Spirit and strive to live constantly in the Spirit, as recommended in Romans 8:5-16, Ephesians 5:18, and Colossians 3:5.",
      ],
    },
    scripture: {
      es: [
        { label: "Joel 2:28-29", query: "Joel 2:28-29" },
        { label: "Juan 7:37-39", query: "John 7:37-39" },
        { label: "Juan 14:16-26", query: "John 14:16-26" },
        { label: "Hechos 2:1-4, 16-18", query: "Acts 2:1-4, 16-18" },
        { label: "Hechos 1:8", query: "Acts 1:8" },
        { label: "Gálatas 5:22-25", query: "Galatians 5:22-25" },
        { label: "Romanos 12:6-8", query: "Romans 12:6-8" },
        { label: "1 Corintios 12:1-12", query: "1 Corinthians 12:1-12" },
        { label: "Efesios 4:7-13", query: "Ephesians 4:7-13" },
        { label: "1 Corintios 12:11", query: "1 Corinthians 12:11" },
        { label: "Efesios 4:7", query: "Ephesians 4:7" },
      ],
      en: [
        { label: "Joel 2:28-29", query: "Joel 2:28-29" },
        { label: "John 7:37-39", query: "John 7:37-39" },
        { label: "John 14:16-26", query: "John 14:16-26" },
        { label: "Acts 2:1-4, 16-18", query: "Acts 2:1-4, 16-18" },
        { label: "Acts 1:8", query: "Acts 1:8" },
        { label: "Galatians 5:22-25", query: "Galatians 5:22-25" },
        { label: "Romans 12:6-8", query: "Romans 12:6-8" },
        { label: "1 Corinthians 12:1-12", query: "1 Corinthians 12:1-12" },
        { label: "Ephesians 4:7-13", query: "Ephesians 4:7-13" },
        { label: "1 Corinthians 12:11", query: "1 Corinthians 12:11" },
        { label: "Ephesians 4:7", query: "Ephesians 4:7" },
      ],
    },
  },
  {
    n: 6,
    title: { es: "El Bautismo en Agua", en: "Baptism in Water" },
    paragraphs: {
      es: [
        "Creemos en el bautismo en agua, por inmersión y en el Nombre de Jesucristo, el cual debe ser administrado por un ministro ordenado. El bautismo debe ser por inmersión, porque sólo así representa la muerte del hombre al pecado, que debe ser semejante a la muerte de Cristo. Y en el Nombre de Jesucristo, porque ésta es la forma en que los apóstoles y ministros bautizaron en la edad primitiva de la Iglesia, según lo prueban las Sagradas Escrituras.",
      ],
      en: [
        "We believe in baptism in water, by immersion in the Name of Jesus Christ and that it should be administered by an ordained minister. Baptism should be by immersion because only in this way can it represent the death of man unto sin, thus bearing similarity to the death of Christ. Baptism should be in the name of Jesus Christ because this was the practice of the Apostles and ministers who baptized during the early period of the Church, as recorded in the Holy Scriptures.",
      ],
    },
    scripture: {
      es: [
        { label: "Romanos 6:1-5", query: "Romans 6:1-5" },
        { label: "Hechos 2:38", query: "Acts 2:38" },
        { label: "Hechos 8:16", query: "Acts 8:16" },
        { label: "Hechos 10:48", query: "Acts 10:48" },
        { label: "Hechos 19:6", query: "Acts 19:6" },
        { label: "Hechos 22:16", query: "Acts 22:16" },
      ],
      en: [
        { label: "Romans 6:1-5", query: "Romans 6:1-5" },
        { label: "Acts 2:38", query: "Acts 2:38" },
        { label: "Acts 8:16", query: "Acts 8:16" },
        { label: "Acts 10:48", query: "Acts 10:48" },
        { label: "Acts 19:6", query: "Acts 19:6" },
        { label: "Acts 22:16", query: "Acts 22:16" },
      ],
    },
  },
  {
    n: 7,
    title: { es: "La Cena del Señor", en: "The Lord’s Supper" },
    paragraphs: {
      es: [
        "Creemos en la práctica literal de la Cena del Señor que él mismo instituyó. En esta ordenanza se debe usar pan sin levadura, que representa el cuerpo sin pecado de nuestro Señor Jesucristo, y vino sin fermentar, que representa la Sangre de Cristo, que consumó nuestra redención. El objeto de esta ceremonia es conmemorar la muerte de nuestro Señor Jesucristo y anunciar el día en que regresará al mundo y al mismo tiempo para dar testimonio de la comunión que existe entre los creyentes. Ninguna persona debe participar de este acto si no es miembro fiel de la Iglesia y está en plena comunión, pues al hacerlo sin cumplir estas condiciones, no podrá discernir el cuerpo del Señor.",
        "El Señor, al terminar de tomar una cena con sus apóstoles celebró un acto que de momento los maravilló y que fue el lavatorio de pies. Al terminar este acto, el Maestro explicó a sus discípulos el significado de él, y les recomendó que se lavasen los pies los unos a los otros. La Iglesia practica este acto en combinación con la Cena del Señor o indistintamente como un acto de humildad y confraternidad cristiana.",
      ],
      en: [
        "We believe in the literal practice of the Lord’s Supper, which He himself instituted. This ordinance shall make use of unleavened bread that represents the sinless body of our Lord Jesus Christ, and unfermented wine that represents the blood of Christ, which consummated our redemption.",
        "The object of this ceremony is to commemorate the death of our Lord Jesus Christ and to announce the day in which He shall return to the world, at the same time to give testimony of the communion that exists among believers. No person shall participate in this ceremony who is not a faithful church member or is not in full communion; if a person does participate without fulfilling these requirements, he or she will be unable to discern the body of Christ. After partaking of a supper with His apostles, the Lord washed their feet, an act that marveled them at that moment. When He was done, the Master explained to His Disciples the significance of this act, and recommended that they wash one another’s feet. The Church practices this act in combination or indistinctly with the Lord’s Supper as an act of humility and Christian fellowship.",
      ],
    },
    scripture: {
      es: [
        { label: "Mateo 26:26-29", query: "Matthew 26:26-29" },
        { label: "Marcos 14:22-25", query: "Mark 14:22-25" },
        { label: "Lucas 22:15-20", query: "Luke 22:15-20" },
        { label: "1 Corintios 11:23-26", query: "1 Corinthians 11:23-26" },
        { label: "1 Corintios 10:15-17", query: "1 Corinthians 10:15-17" },
        { label: "1 Corintios 11:27-28", query: "1 Corinthians 11:27-28" },
        { label: "2 Corintios 13:5", query: "2 Corinthians 13:5" },
        { label: "1 Timoteo 5:10", query: "1 Timothy 5:10" },
      ],
      en: [
        { label: "Matthew 26:26-29", query: "Matthew 26:26-29" },
        { label: "Mark 14:22-25", query: "Mark 14:22-25" },
        { label: "Luke 22:15-20", query: "Luke 22:15-20" },
        { label: "1 Corinthians 11:23-26", query: "1 Corinthians 11:23-26" },
        { label: "1 Corinthians 10:15-17", query: "1 Corinthians 10:15-17" },
        { label: "1 Corinthians 11:27-28", query: "1 Corinthians 11:27-28" },
        { label: "2 Corinthians 13:5", query: "2 Corinthians 13:5" },
        { label: "1 Timothy 5:10", query: "1 Timothy 5:10" },
      ],
    },
  },
  {
    n: 8,
    title: { es: "La Resurrección de Jesucristo", en: "The Resurrection of Jesus Christ" },
    paragraphs: {
      es: [
        "Creemos en la resurrección literal de nuestro Señor Jesucristo que se efectuó al tercer día de su muerte, como lo relatan los evangelistas. Esta resurrección había sido anunciada por los profetas y es necesaria para nuestra esperanza y justificación.",
      ],
      en: [
        "We believe in the literal resurrection of Jesus Christ, which took place on the third day after His death as recorded in the Gospels. This resurrection had been foretold by the prophets, and is necessary for our hope and justification.",
      ],
    },
    scripture: {
      es: [
        { label: "Mateo 27:60-64", query: "Matthew 27:60-64" },
        { label: "Marcos 16:1-20", query: "Mark 16:1-20" },
        { label: "Lucas 24:1-12, 36-44", query: "Luke 24:1-12, 36-44" },
        { label: "Juan 20:12-20", query: "John 20:12-20" },
        { label: "Isaías 53:12", query: "Isaiah 53:12" },
        { label: "1 Corintios 15:20", query: "1 Corinthians 15:20" },
        { label: "Romanos 4:25", query: "Romans 4:25" },
      ],
      en: [
        { label: "Matthew 27:60-64", query: "Matthew 27:60-64" },
        { label: "Mark 16:1-20", query: "Mark 16:1-20" },
        { label: "Luke 24:1-12, 36-44", query: "Luke 24:1-12, 36-44" },
        { label: "John 20:12-20", query: "John 20:12-20" },
        { label: "Isaiah 53:12", query: "Isaiah 53:12" },
        { label: "1 Corinthians 15:20", query: "1 Corinthians 15:20" },
        { label: "Romans 4:25", query: "Romans 4:25" },
      ],
    },
  },
  {
    n: 9,
    title: {
      es: "La Resurrección de Justos e Injustos",
      en: "The Resurrection of the Just and Unjust",
    },
    paragraphs: {
      es: [
        "Creemos que habrá una resurrección literal de los muertos en el Señor, en la cual serán cubiertos con un cuerpo glorificado y espiritual, con el cual vivirán para siempre en la presencia del Señor. Los cristianos que estén en pie en el momento en que el Señor recoja a su Iglesia serán igualmente transformados y así irán a estar con el Señor para siempre en gloria.",
        "Creemos también que habrá resurrección de injustos pero estos despertarán del sueño de la tumba sólo para ser juzgados y oír la dura sentencia que los hará herederos del fuego eterno.",
      ],
      en: [
        "We believe that there will be a literal resurrection of the dead in Christ and that they will be given a glorified and spiritual body in which they will live forever in the presence of the Lord. Christians who are living when Christ comes to take up His Church will likewise be transformed and taken to live forever in glory in the presence of the Lord.",
        "We also believe that there will be resurrection of the unjust, but that these will awake from the tombs only to be judged and hear the harsh sentence that will make them heirs of eternal fire.",
      ],
    },
    scripture: {
      es: [
        { label: "Juan 5:29", query: "John 5:29" },
        { label: "Hechos 24:15", query: "Acts 24:15" },
        { label: "1 Tesalonicenses 4:16", query: "1 Thessalonians 4:16" },
        { label: "Job 19:25-27", query: "Job 19:25-27" },
        { label: "Salmos 17:15", query: "Psalms 17:15" },
        { label: "1 Corintios 15:35-54", query: "1 Corinthians 15:35-54" },
        { label: "1 Tesalonicenses 4:18", query: "1 Thessalonians 4:18" },
        { label: "1 Corintios 15:51-52", query: "1 Corinthians 15:51-52" },
        { label: "Mateo 25:26", query: "Matthew 25:26" },
        { label: "Apocalipsis 20:12-15", query: "Revelation 20:12-15" },
        { label: "Marcos 9:44", query: "Mark 9:44" },
        { label: "Daniel 12:2", query: "Daniel 12:2" },
      ],
      en: [
        { label: "John 5:29", query: "John 5:29" },
        { label: "Acts 24:15", query: "Acts 24:15" },
        { label: "1 Thessalonians 4:16", query: "1 Thessalonians 4:16" },
        { label: "Job 19:25-27", query: "Job 19:25-27" },
        { label: "Psalms 17:15", query: "Psalms 17:15" },
        { label: "1 Corinthians 15:35-54", query: "1 Corinthians 15:35-54" },
        { label: "1 Thessalonians 4:18", query: "1 Thessalonians 4:18" },
        { label: "1 Corinthians 15:51-52", query: "1 Corinthians 15:51-52" },
        { label: "Matthew 25:26", query: "Matthew 25:26" },
        { label: "Revelation 20:12-15", query: "Revelation 20:12-15" },
        { label: "Mark 9:44", query: "Mark 9:44" },
        { label: "Daniel 12:2", query: "Daniel 12:2" },
      ],
    },
  },
  {
    n: 10,
    title: {
      es: "El Recogimiento de la Iglesia y el Milenio",
      en: "The Rapture of the Church and the Millennium",
    },
    paragraphs: {
      es: [
        "Creemos que la Iglesia, compuesta por los muertos en el Señor y los fieles que estén sobre la tierra en el momento del Rapto, será levantada para ir a encontrar a su Señor en los aires y participar en las Bodas del Cordero. Después vendrá con el Señor a la tierra para hacer el juicio de las naciones y reinar con Cristo mil años. Este período será precedido por la Gran Tribulación y la batalla del Armagedón, a la cual dará fin el Señor cuando descienda sobre el Monte de los Olivos con todos sus santos.",
      ],
      en: [
        "We believe that the Church, composed of the dead in Christ and the faithful living on earth at the time of the Rapture, will be lifted up to meet the Lord in the air and to take part in the wedding feast of the Lamb of God.",
        "Thereafter, the Church will descend with the Lord to earth to pass judgment upon the nations and reign with Christ for a thousand years. This period will be preceded by the Great Tribulation and the Battle of Armageddon, which the Lord will end upon descending on the Mount of Olives with all His saints.",
      ],
    },
    scripture: {
      es: [
        { label: "1 Tesalonicenses 4:13-17", query: "1 Thessalonians 4:13-17" },
        { label: "1 Corintios 15:51-54", query: "1 Corinthians 15:51-54" },
        { label: "Filipenses 3:20-21", query: "Philippians 3:20-21" },
        { label: "Isaías 65:17-25", query: "Isaiah 65:17-25" },
        { label: "Daniel 7:27", query: "Daniel 7:27" },
        { label: "Miqueas 4:1-3", query: "Micah 4:1-3" },
        { label: "Zacarías 14:1-16", query: "Zechariah 14:1-16" },
        { label: "Mateo 5:5", query: "Matthew 5:5" },
        { label: "Romanos 11:25-27", query: "Romans 11:25-27" },
        { label: "Apocalipsis 20:1-5", query: "Revelation 20:1-5" },
      ],
      en: [
        { label: "1 Thessalonians 4:13-17", query: "1 Thessalonians 4:13-17" },
        { label: "1 Corinthians 15:51-54", query: "1 Corinthians 15:51-54" },
        { label: "Philippians 3:20-21", query: "Philippians 3:20-21" },
        { label: "Isaiah 65:17-25", query: "Isaiah 65:17-25" },
        { label: "Daniel 7:27", query: "Daniel 7:27" },
        { label: "Micah 4:1-3", query: "Micah 4:1-3" },
        { label: "Zechariah 14:1-16", query: "Zechariah 14:1-16" },
        { label: "Matthew 5:5", query: "Matthew 5:5" },
        { label: "Romans 11:25-27", query: "Romans 11:25-27" },
        { label: "Revelation 20:1-5", query: "Revelation 20:1-5" },
      ],
    },
  },
  {
    n: 11,
    title: { es: "El Juicio Final", en: "The Final Judgment" },
    paragraphs: {
      es: [
        "Creemos que hay un juicio preparado en el cual participarán todos los hombres que hayan muerto sin Cristo y los que estén sobre la tierra en el tiempo de su verificación. Este juicio se efectuará al final del milenio y también se conoce con el nombre de Juicio del Trono Blanco. La Iglesia no será juzgada en esta ocasión, sino que ella misma intervendrá en el juicio que se haga a todos los hombres de acuerdo con lo que está escrito en los libros que Dios tiene preparados.",
        "Al terminarse este juicio, los cielos y la tierra que hoy existen serán renovados por fuego y los fieles habitarán en la Nueva Jerusalén. La dispensación cristiana habrá terminado y entonces Dios volverá a ser todas las cosas en todos.",
      ],
      en: [
        "We believe the Lord has prepared a judgment day in which all men who have died without Christ and those living upon the earth at the time of its verification will participate. This judgment, also known as the “Judgment of the Great White Throne,” will take place at the end of the Millennium. The Church will not be judged on this occasion, but will itself intervene in the judgment rendered to all men in accordance with the things written in the books that God has prepared.",
        "At the end of this judgment, the present heavens and the earth will be renewed by fire and the faithful will dwell in the New Jerusalem. The Christian dispensation will have come to its end and God will be all things in all.",
      ],
    },
    scripture: {
      es: [
        { label: "Daniel 7:8-10, 14, 18", query: "Daniel 7:8-10, 14, 18" },
        { label: "1 Corintios 6:2-3", query: "1 Corinthians 6:2-3" },
        { label: "Romanos 2:16", query: "Romans 2:16" },
        { label: "Romanos 14:10", query: "Romans 14:10" },
        { label: "1 Corintios 5:10", query: "1 Corinthians 5:10" },
        { label: "Apocalipsis 20:5-15", query: "Revelation 20:5-15" },
        { label: "Apocalipsis 21:1-6", query: "Revelation 21:1-6" },
      ],
      en: [
        { label: "Daniel 7:8-10, 14, 18", query: "Daniel 7:8-10, 14, 18" },
        { label: "1 Corinthians 6:2-3", query: "1 Corinthians 6:2-3" },
        { label: "Romans 2:16", query: "Romans 2:16" },
        { label: "Romans 14:10", query: "Romans 14:10" },
        { label: "1 Corinthians 5:10", query: "1 Corinthians 5:10" },
        { label: "Revelation 20:5-15", query: "Revelation 20:5-15" },
        { label: "Revelation 21:1-6", query: "Revelation 21:1-6" },
      ],
    },
  },
  {
    n: 12,
    title: { es: "La Sanidad Divina", en: "Divine Healing" },
    paragraphs: {
      es: [
        "Creemos que Dios tiene poder para sanar todas nuestras dolencias físicas, si así es su voluntad y que la Sanidad Divina es un resultado del sacrificio de Cristo; pues Él llevó nuestras enfermedades y sufrió nuestros dolores. La sanidad del cuerpo se efectúa por una combinación de la fe del creyente y del poder del Nombre de Jesucristo que se invoca sobre el enfermo. El Señor Jesucristo prometió que los que creyeran en su Nombre pondrían las manos sobre los enfermos y estos sanarían. Los enfermos deben ser ungidos con aceite en el Nombre de Jesucristo por ministros ordenados para que el Señor cumpla sus promesas.",
        "Creemos que la Sanidad Divina se obtiene por la fe y que en caso de que algún hermano tenga necesidad de someterse a los cuidados y ministraciones de la ciencia médica, los demás no deben criticarlo, sino considerarse a sí mismos y guardarse de encontrar condenación con lo que ellos mismos aprueban. Recomendamos que los miembros y ministros de nuestra Iglesia se abstengan de lanzar críticas indebidas a la ciencia médica, cuyos adelantos nadie puede negar y que se originan en la habilidad que Dios ha dado a los hombres para ir descubriendo los secretos del funcionamiento del organismo humano. Al mismo tiempo, los exhortamos a que no se opongan a las campañas de higiene, vacunación y limpieza que sean iniciadas por el gobierno, sino que, por lo contrario, colaboren decididamente en los lugares donde sea posible.",
      ],
      en: [
        "We believe that God has the power to heal all our physical illnesses, if that is His will, and that divine healing is a result of the sacrifice of Christ, for He has borne our griefs and carried our sorrows. The healing of the body takes place through a combination of the faith of the believer and power in the Name of Jesus Christ, whose Name is invoked when praying for the sick. The Lord Jesus Christ promised that those who believed in His Name would lay hands on the sick and the sick would recover. The sick shall be anointed with oil in the Name of Jesus Christ by ordained ministers for the Lord to fulfill His promises.",
        "We believe that divine healing is obtained through faith. If, on occasion, a brother needs to submit himself to the care and ministration of medical science, he should not be criticized by his fellow church members, who must weigh the matter and consider themselves lest they be condemned by what they themselves approve. We recommend that all members and ministers of our Church abstain from improper criticisms of medical science, whose advancements cannot be denied and originate in the ability that God has given men to discover the secrets of the functioning of the human organism. We also advise against opposing government campaigns for hygiene, vaccination, and cleanliness; instead, we advise that they cooperate in these campaigns decidedly wherever possible.",
      ],
    },
    scripture: {
      es: [
        { label: "Isaías 53:4", query: "Isaiah 53:4" },
        { label: "Marcos 16:18", query: "Mark 16:18" },
        { label: "Juan 14:13", query: "John 14:13" },
        { label: "Salmos 103:1-4", query: "Psalms 103:1-4" },
        { label: "Lucas 9:1-3", query: "Luke 9:1-3" },
        { label: "1 Corintios 12:9", query: "1 Corinthians 12:9" },
        { label: "Santiago 5:14-16", query: "James 5:14-16" },
        { label: "Romanos 14:22", query: "Romans 14:22" },
      ],
      en: [
        { label: "Isaiah 53:4", query: "Isaiah 53:4" },
        { label: "Mark 16:18", query: "Mark 16:18" },
        { label: "John 14:13", query: "John 14:13" },
        { label: "Psalm 103:1-4", query: "Psalm 103:1-4" },
        { label: "Luke 9:1-3", query: "Luke 9:1-3" },
        { label: "1 Corinthians 12:9", query: "1 Corinthians 12:9" },
        { label: "James 5:14-16", query: "James 5:14-16" },
        { label: "Romans 14:22", query: "Romans 14:22" },
      ],
    },
  },
  {
    n: 13,
    title: { es: "La Santidad", en: "Holiness" },
    paragraphs: {
      es: [
        "Creemos que todos los miembros del cuerpo de Cristo deben ser santos, es decir, apartados de todo pecado y consagrados al servicio de Dios. Por esta razón deben abstenerse de toda clase de prácticas, diversiones e inmundicias de carne y de espíritu.",
        "Sin embargo, en la práctica de la santidad, creemos que debe evitarse toda clase de extremismos, ascetismos y privaciones que tienen cierta reputación de sabiduría, en culto voluntario y humildad y en duro trato de la carne, la cual es sombra de lo por venir, mas el cuerpo es de Cristo. En lo que respecta a alimentos, sabiendo que “todo lo que Dios creó es bueno, y nada es de desecharse, si se toma con acción de gracias”.",
      ],
      en: [
        "We believe that all members of the Body of Christ should be holy; that is, separated from sin and consecrated for the service of the Lord. For this reason they must abstain from all practices, entertainment, and filthiness of flesh and spirit.",
        "However, in the practice of holiness we believe that we must avoid all extremes, asceticisms and deprivations with reputation of wisdom in self-imposed worship and humility, and unsparing severity of the body, all which are but a shadow of things to come, but the body is of Christ. Regarding food, we note that “every creature of God is good, and nothing to be refused, if it be received with thanksgiving”.",
      ],
    },
    scripture: {
      es: [
        { label: "Levítico 19:2", query: "Leviticus 19:2" },
        { label: "2 Corintios 7:1", query: "2 Corinthians 7:1" },
        { label: "Efesios 5:26-27", query: "Ephesians 5:26-27" },
        { label: "1 Tesalonicenses 4:3-4", query: "1 Thessalonians 4:3-4" },
        { label: "2 Timoteo 2:21", query: "2 Timothy 2:21" },
        { label: "Hebreos 12:14", query: "Hebrews 12:14" },
        { label: "1 Pedro 1:16", query: "1 Peter 1:16" },
        { label: "Colosenses 2:17, 23", query: "Colossians 2:17, 23" },
        { label: "1 Timoteo 4:4", query: "1 Timothy 4:4" },
      ],
      en: [
        { label: "Leviticus 19:2", query: "Leviticus 19:2" },
        { label: "2 Corinthians 7:1", query: "2 Corinthians 7:1" },
        { label: "Ephesians 5:26-27", query: "Ephesians 5:26-27" },
        { label: "1 Thessalonians 4:3-4", query: "1 Thessalonians 4:3-4" },
        { label: "2 Timothy 2:21", query: "2 Timothy 2:21" },
        { label: "Hebrews 12:14", query: "Hebrews 12:14" },
        { label: "1 Peter 1:16", query: "1 Peter 1:16" },
        { label: "Colossians 2:17, 23", query: "Colossians 2:17, 23" },
        { label: "1 Timothy 4:4", query: "1 Timothy 4:4" },
      ],
    },
  },
  {
    n: 14,
    title: { es: "Matrimonio", en: "Matrimony" },
    paragraphs: {
      es: [
        "Creemos que el matrimonio es sagrado, pues fue establecido desde el principio y es honroso en todos. Los matrimonios deben verificarse de acuerdo con las leyes de los países respectivos y luego solemnizarse en la Iglesia según la práctica aprobada. Las parejas que no hayan legalizado su unión y deseen bautizarse, deben cumplir primeramente con los requisitos de las leyes civiles.",
        "Creemos que el matrimonio es una unión que debe perdurar mientras viven los dos cónyuges. Al morir uno de ellos, el otro está libre para casarse y no peca si lo hace en el Señor.",
        "Creemos además, que los matrimonios deben verificarse exclusivamente entre miembros fieles. Ningún ministro deberá casar a un miembro de la iglesia con una persona inconversa. Los miembros que estando en plena comunión se casaren con una persona inconversa, deberán ser juzgados por los pastores.",
      ],
      en: [
        "We believe that marriage is sacred, since it was instituted in the beginning, and honorable among all people. Marriages must be verified in accordance with the laws of the respective countries, and later solemnized in church in accordance with approved practices. Couples who have not legalized their union and wish to be baptized must first meet the requirements of civil laws.",
        "We believe that when a couple unites in marriage, they should remain united as long as both live. When either one dies, the other is free to remarry and does not commit sin if he or she remarries in the Lord.",
        "We also believe that marriages shall take place solely among faithful church members. No minister shall perform a marriage ceremony between a church member and an unbeliever. Church members in full communion who marry unbelievers shall be judged by their pastors.",
      ],
    },
    scripture: {
      es: [
        { label: "Génesis 2:21-24", query: "Genesis 2:21-24" },
        { label: "Mateo 19:1-5", query: "Matthew 19:1-5" },
        { label: "Hebreos 13:4", query: "Hebrews 13:4" },
        { label: "Romanos 7:1-3", query: "Romans 7:1-3" },
        { label: "1 Corintios 7:39", query: "1 Corinthians 7:39" },
      ],
      en: [
        { label: "Genesis 2:21-24", query: "Genesis 2:21-24" },
        { label: "Matthew 19:1-5", query: "Matthew 19:1-5" },
        { label: "Hebrews 13:4", query: "Hebrews 13:4" },
        { label: "Romans 7:1-3", query: "Romans 7:1-3" },
        { label: "1 Corinthians 7:39", query: "1 Corinthians 7:39" },
      ],
    },
  },
  {
    n: 15,
    title: { es: "El Estado y la Iglesia", en: "Church and State" },
    paragraphs: {
      es: [
        "Creemos en la separación del Estado y la Iglesia y que ninguno debe intervenir en los asuntos del otro, pues aquí se cumple el precepto bíblico de dar lo que es de César a César y lo que es de Dios a Dios.",
        "Los cristianos deben tomar participación en actividades cívicas de acuerdo con su capacidad e inclinaciones políticas, pero siempre reflejando sus ideas personales y no las de la Iglesia. La Asamblea Apostólica siempre es neutral y tiene cabida para los hombres de todos los credos políticos. Al mismo tiempo, todos los cristianos deben obedecer a las autoridades civiles y todas las leyes y disposiciones que de ellas emanen, siempre que no contradigan sus principios religiosos o los obliguen a hacer cosas en contra de su conciencia.",
      ],
      en: [
        "We believe in the separation of Church and State and that neither should intervene in the internal affairs of the other since this fulfills the biblical precept “render to Caesar the things that are Caesar’s and to God the things that are God’s”. Christians should participate in civil activities according to their abilities and political inclinations, always reflecting their own personal ideas and opinions, and not those of the Church. The Apostolic Assembly is always neutral and has room for men of all political creeds. Nevertheless, all Christians must obey civil authorities and the laws and ordinances issued by these authorities, unless these laws contradict religious principles or force Christians to act against their conscience.",
      ],
    },
    scripture: {
      es: [
        { label: "Marcos 12:17", query: "Mark 12:17" },
        { label: "Romanos 13:1-7", query: "Romans 13:1-7" },
      ],
      en: [
        { label: "Mark 12:17", query: "Mark 12:17" },
        { label: "Romans 13:1-7", query: "Romans 13:1-7" },
      ],
    },
  },
  {
    n: 16,
    title: { es: "Servicio Militar", en: "Military Service" },
    paragraphs: {
      es: [
        "La Asamblea Apostólica de la Fe en Cristo Jesús reconoce al gobierno humano como de ordenación Divina y al hacerlo así, exhorta a sus miembros a que afirmen su lealtad a su patria. Siendo discípulos del Señor Jesucristo, es deber de todo cristiano obedecer sus preceptos y mandamientos que enseñan como sigue: “No resistáis al que es malo”. “Seguid la paz con todos”. También. Por estas Escrituras, se cree y se interpreta que los seguidores de nuestro Señor Jesucristo no deben destruir propiedades ajenas o quitar vidas humanas.",
        "Se considera un pecado, que después de haber recibido el conocimiento de la verdad, haber sido hechos nuevas criaturas en Cristo Jesús, participar en acciones o actos diferentes a aquellos recomendados por la Divina Palabra de Dios.",
        "Por lo tanto, se aconseja a todos los miembros que de acuerdo al dictamen de su conciencia, sirvan libremente a su patria, en tiempo de paz o de guerra, y prestar servicio, no importando cuán duro o peligroso sea, en todas las capacidades NO COMBATIENTES. La Doctrina enseña que se ore porque tengamos siempre hombres de Dios como gobernantes y orar por ellos para que tengan siempre la sabiduría Divina y para que como nación seamos guardados fuera de la guerra, con honor y vivir en paz continuamente.",
      ],
      en: [
        "The Apostolic Assembly recognizes human government as ordained by God. Therefore, the Apostolic Assembly admonishes its members to affirm loyalty to their country. As disciples of our Lord Jesus Christ, Christians must obey His precepts and commandments as follows: “But I say unto you, That ye resist not evil”. “Follow peace with all men”. Given these scriptures, it is believed and interpreted that the followers of our Lord Jesus Christ shall neither destroy someone else’s property nor take someone’s life.",
        "It is considered a sin to participate in acts contrary to those recommended by the Holy Word of God, after having received the knowledge of the truth and having been made new creatures in Christ Jesus.",
        "All members, therefore, are advised to follow their conscience in freely serving their country, whether in time of peace or war, and in any capacity no matter how hard or dangerous it may be, as long as it is of NONCOMBATANT CHARACTER. Doctrine teaches us to pray that we may always have men of God in authority. It teaches us to pray for them that they may receive divine guidance so that we as a nation might steer clear of any war and live continually in honor and peace.",
      ],
    },
    scripture: {
      es: [
        { label: "Romanos 13:1-2", query: "Romans 13:1-2" },
        { label: "Mateo 5:39", query: "Matthew 5:39" },
        { label: "Hebreos 12:14", query: "Hebrews 12:14" },
        { label: "Romanos 12:19", query: "Romans 12:19" },
        { label: "Mateo 26:52", query: "Matthew 26:52" },
        { label: "Santiago 5:6", query: "James 5:6" },
        { label: "Apocalipsis 13:10", query: "Revelation 13:10" },
        { label: "Hebreos 6:4-9", query: "Hebrews 6:4-9" },
        { label: "Hebreos 10:26-27", query: "Hebrews 10:26-27" },
        { label: "1 Timoteo 2:1-3", query: "1 Timothy 2:1-3" },
      ],
      en: [
        { label: "Romans 13:1-2", query: "Romans 13:1-2" },
        { label: "Matthew 5:39", query: "Matthew 5:39" },
        { label: "Hebrews 12:14", query: "Hebrews 12:14" },
        { label: "Romans 12:19", query: "Romans 12:19" },
        { label: "Matthew 26:52", query: "Matthew 26:52" },
        { label: "James 5:6", query: "James 5:6" },
        { label: "Revelation 13:10", query: "Revelation 13:10" },
        { label: "2 Corinthians 5:17", query: "2 Corinthians 5:17" },
        { label: "Hebrews 6:4-9", query: "Hebrews 6:4-9" },
        { label: "Hebrews 10:26-27", query: "Hebrews 10:26-27" },
        { label: "1 Timothy 2:1-3", query: "1 Timothy 2:1-3" },
      ],
    },
  },
  {
    n: 17,
    title: { es: "Pecado de Muerte", en: "Sin Unto Death" },
    paragraphs: {
      es: [
        "Creemos, a la luz de la Palabra de Dios, que hay pecado de muerte y que si este es cometido en los términos que expresa la misma Biblia, se pierde el derecho a la salvación. Por tanto, recomendamos que todos los fieles se abstengan de dar oído a doctrinas en que se promete seguridad eterna al cristiano sin importar su conducta, y la idea de que “una vez salvo, siempre salvo,” pues la Biblia enseña que es posible ser reprobado y se necesita permanecer fiel hasta el fin.",
      ],
      en: [
        "We believe, by the light of the Word of God, that there is a sin unto death and that if this sin is committed in the terms expressed in the Bible, the right to salvation is lost. Therefore, we recommend that the faithful abstain from giving ear to doctrines that promise eternal security to the Christian regardless of his conduct and the idea that “once saved, always saved.” The Bible teaches that it is possible to be reproved and that we must remain faithful unto the end.",
      ],
    },
    scripture: {
      es: [
        { label: "Mateo 12:31-32", query: "Matthew 12:31-32" },
        { label: "Romanos 6:23", query: "Romans 6:23" },
        { label: "Hebreos 10:26-27", query: "Hebrews 10:26-27" },
        { label: "1 Juan 5:16-17", query: "1 John 5:16-17" },
        { label: "Romanos 2:6-10", query: "Romans 2:6-10" },
        { label: "1 Corintios 9:26-27", query: "1 Corinthians 9:26-27" },
      ],
      en: [
        { label: "Matthew 12:31-32", query: "Matthew 12:31-32" },
        { label: "Romans 6:23", query: "Romans 6:23" },
        { label: "Hebrews 10:26-27", query: "Hebrews 10:26-27" },
        { label: "1 John 5:16-17", query: "1 John 5:16-17" },
        { label: "Romans 2:6-10", query: "Romans 2:6-10" },
        { label: "1 Corinthians 9:26-27", query: "1 Corinthians 9:26-27" },
      ],
    },
  },
  {
    n: 18,
    title: { es: "Sistema Económico de la Iglesia", en: "Economic System of the Church" },
    paragraphs: {
      es: [
        "Creemos que el sistema que la Biblia enseña para la obtención de fondos necesarios para el cumplimiento de la obra es el de diezmos y ofrendas y que debe ser practicado por ministros y creyentes igualmente.",
        "Sabiendo que la obra de Dios no tan sólo tiene aspecto espiritual, sino también material, creemos que es necesario reglamentar la manera en que se adquieran y distribuyan los fondos necesarios para responder a las necesidades materiales de la obra.",
      ],
      en: [
        "We believe that the system that the Bible teaches us to obtain the funds necessary to carry out the work of the Lord is that of tithes and offerings, and that this system must be practiced by ministers and believers alike.",
        "Knowing that the work of the Lord is not only spiritual but also of a material nature, we believe that it is necessary to regulate the acquisition and distribution of the necessary funds to meet the material needs of the work.",
      ],
    },
    scripture: {
      es: [
        { label: "Génesis 28:22", query: "Genesis 28:22" },
        { label: "Malaquías 3:10", query: "Malachi 3:10" },
        { label: "Mateo 23:23", query: "Matthew 23:23" },
        { label: "Lucas 6:38", query: "Luke 6:38" },
        { label: "Hechos 11:27, 30", query: "Acts 11:27, 30" },
        { label: "1 Corintios 9:3-14", query: "1 Corinthians 9:3-14" },
        { label: "1 Corintios 16:1-2", query: "1 Corinthians 16:1-2" },
        { label: "2 Corintios 8:1-16", query: "2 Corinthians 8:1-16" },
        { label: "2 Corintios 9:6-12", query: "2 Corinthians 9:6-12" },
        { label: "2 Corintios 11:7-9", query: "2 Corinthians 11:7-9" },
        { label: "1 Timoteo 5:17-18", query: "1 Timothy 5:17-18" },
        { label: "1 Timoteo 6:17-19", query: "1 Timothy 6:17-19" },
        { label: "Gálatas 6:6-10", query: "Galatians 6:6-10" },
        { label: "Filipenses 4:10-12, 15-19", query: "Philippians 4:10-12, 15-19" },
        { label: "Hebreos 13:16", query: "Hebrews 13:16" },
      ],
      en: [
        { label: "Genesis 28:22", query: "Genesis 28:22" },
        { label: "Malachi 3:10", query: "Malachi 3:10" },
        { label: "Matthew 23:23", query: "Matthew 23:23" },
        { label: "Luke 6:38", query: "Luke 6:38" },
        { label: "Acts 11:27, 30", query: "Acts 11:27, 30" },
        { label: "1 Corinthians 9:3-14", query: "1 Corinthians 9:3-14" },
        { label: "1 Corinthians 16:1-2", query: "1 Corinthians 16:1-2" },
        { label: "2 Corinthians 8:1-16", query: "2 Corinthians 8:1-16" },
        { label: "2 Corinthians 9:6-12", query: "2 Corinthians 9:6-12" },
        { label: "2 Corinthians 11:7-9", query: "2 Corinthians 11:7-9" },
        { label: "1 Timothy 5:17-18", query: "1 Timothy 5:17-18" },
        { label: "1 Timothy 6:17-19", query: "1 Timothy 6:17-19" },
        { label: "Galatians 6:6-10", query: "Galatians 6:6-10" },
        { label: "Philippians 4:10-12, 15-19", query: "Philippians 4:10-12, 15-19" },
        { label: "Hebrews 13:16", query: "Hebrews 13:16" },
      ],
    },
  },
  {
    n: 19,
    title: { es: "El Cuerpo Ministerial", en: "The Ministerial Body" },
    paragraphs: {
      es: [
        "Creemos que el ministerio es un llamamiento de Dios y que el Espíritu Santo confiere a cada ministro la facultad de servir a la Iglesia en distintas capacidades y con distintos dones, cuyas manifestaciones son todas para edificación del Cuerpo de Cristo.",
        "Creemos también que, aunque el llamamiento al ministerio es de origen Divino, la Palabra de Dios contiene suficientes enseñanzas sobre los requisitos que debe llenar la persona que vaya a servir en el ministerio y que corresponde a los gobiernos eclesiásticos debidamente organizados examinar a los candidatos al ministerio y determinar cuándo son dignos de aprobación, y la tarea a que se deben dedicar.",
        "Creemos además, que el Espíritu Santo usa al ministro en distintas formas, según las necesidades de la obra de Dios y la capacidad y disposición personal del ministro. Nadie puede ser colocado en una posición más elevada que aquella a que se haga merecedor.",
        "Creemos que el obispado es el cargo más elevado en el ministerio y que a quienes lo ocupan se les debe dar muestras especiales de consideración y respeto, sin menoscabo de los que ocupan posiciones de menor responsabilidad.",
      ],
      en: [
        "We believe that the ministry is a calling of God and that the Holy Spirit confers upon each minister the faculty of serving the church in distinct capacities and with distinct gifts, the manifestations of which are all for the edification of the Body of Christ.",
        "We believe that the calling to the ministry is of divine origin and the Word of God contains sufficient teaching regarding the requirements that must be met by the person who is to serve in the ministry. Therefore, duly organized ecclesiastical governments are responsible for examining candidates for the ministry to determine whether these candidates should be approved and what tasks they shall be assigned.",
        "We also believe that the Holy Spirit uses the minister in various ways according to the needs of the work of the Lord and the capability and personal disposition of the ministers. No one can be placed in a higher position than that of which he is worthy.",
        "We believe that the bishopric is the highest office work in the ministry. Bishops shall therefore receive special respect and consideration, but without detriment to those who occupy lesser positions.",
      ],
    },
    scripture: {
      es: [
        { label: "Romanos 12:6-8", query: "Romans 12:6-8" },
        { label: "1 Corintios 12:5-11", query: "1 Corinthians 12:5-11" },
        { label: "Efesios 4:11-12", query: "Ephesians 4:11-12" },
        { label: "Hechos 1:23-26", query: "Acts 1:23-26" },
        { label: "Hechos 6:1-3", query: "Acts 6:1-3" },
        { label: "1 Timoteo 3:1-10", query: "1 Timothy 3:1-10" },
        { label: "1 Timoteo 4:14", query: "1 Timothy 4:14" },
        { label: "1 Timoteo 5:22", query: "1 Timothy 5:22" },
        { label: "Tito 1:5-9", query: "Titus 1:5-9" },
        { label: "1 Timoteo 3:13", query: "1 Timothy 3:13" },
        { label: "Romanos 12:3", query: "Romans 12:3" },
      ],
      en: [
        { label: "Romans 12:6-8", query: "Romans 12:6-8" },
        { label: "1 Corinthians 12:5-11", query: "1 Corinthians 12:5-11" },
        { label: "Ephesians 4:11-12", query: "Ephesians 4:11-12" },
        { label: "Acts 1:23-26", query: "Acts 1:23-26" },
        { label: "Acts 6:1-3", query: "Acts 6:1-3" },
        { label: "1 Timothy 3:1-10", query: "1 Timothy 3:1-10" },
        { label: "1 Timothy 4:14", query: "1 Timothy 4:14" },
        { label: "1 Timothy 5:22", query: "1 Timothy 5:22" },
        { label: "Titus 1:5-9", query: "Titus 1:5-9" },
        { label: "1 Timothy 3:13", query: "1 Timothy 3:13" },
        { label: "Romans 12:3", query: "Romans 12:3" },
      ],
    },
  },
];

export function scriptureUrl(ref: ScriptureRef, lang: "es" | "en"): string {
  const version = lang === "es" ? "RVR1960" : "KJV";
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref.query)}&version=${version}`;
}
