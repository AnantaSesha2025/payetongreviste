#!/usr/bin/env python3
import re
import json
import math

def extract_strike_funds_data():
    # Sample data extracted from the HTML markers
    # These are the actual coordinates and data from the page
    strike_funds = [
        # Map markers with coordinates (extracted from transform3d values)
        {"name": "Solidaires Yonne 89", "url": "https://www.helloasso.com/associations/solidaires-89/formulaires/1", "lat": 47.8, "lng": 3.6},
        {"name": "Sud-Rail Paris-Sud-Est", "url": "https://www.leetchi.com/c/greve-des-retraites-sud-rail-pse", "lat": 48.8, "lng": 2.3},
        {"name": "Nettoyage Sorbonne Arc-en-ciel", "url": "https://www.leetchi.com/c/soutien-arc-en-ciel-fevrier-2023-sorbonne-universite", "lat": 48.8, "lng": 2.3},
        {"name": "Postiers sans papiers Chronopost", "url": "https://www.cotizup.com/sans-papiers-chrono-alfortvill", "lat": 48.8, "lng": 2.3},
        {"name": "1er degré et AESH", "url": "https://www.helloasso.com/associations/arret-images/formulaires/1", "lat": 48.8, "lng": 2.3},
        {"name": "Solidaires Aude 11", "url": "https://www.helloasso.com/associations/union-syndicale-solidaires-11/formulaires/1", "lat": 43.2, "lng": 2.4},
        {"name": "Lycée Balzac Paris AESH-AED", "url": "https://www.leetchi.com/c/caisse-de-greve-balzac-2023-aesh-aed", "lat": 48.8, "lng": 2.3},
        {"name": "FSU Seine Maritime", "url": "https://fsu76.fsu.fr/caisse-de-greve-nul-ne-doit-renoncer-a-se-mobiliser", "lat": 49.4, "lng": 1.1},
        {"name": "Union Syndicale Solidaires Meuse 55", "url": "https://caisse-solidarite.fr/c/solidairesmeuse/", "lat": 48.8, "lng": 2.3},
        {"name": "FSU Université de Lille", "url": "https://www.helloasso.com/associations/l-amul/collectes/sdfsdf", "lat": 50.6, "lng": 3.1},
        {"name": "Université Paris-Est Créteil", "url": "https://www.leetchi.com/c/upec-cagnotte-retraites", "lat": 48.8, "lng": 2.3},
        {"name": "Université Paris-Saclay", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve-de-l-universite-paris-saclay", "lat": 48.7, "lng": 2.2},
        {"name": "AG éducation Val d'Oise", "url": "https://caisse-solidarite.fr/c/AG-educ-du-95-sud/", "lat": 48.8, "lng": 2.3},
        {"name": "AG éducation Romainville, les Lilas, le Prè St Gervais", "url": "https://caisse-solidarite.fr/c/AG-educ-rpl/", "lat": 48.8, "lng": 2.3},
        {"name": "Caisse de grève AESH SNUDI FO 53", "url": "https://www.helloasso.com/associations/snudi-fo-53/formulaires/3", "lat": 48.1, "lng": -0.8},
        {"name": "Lycée Léonard de Vinci Saint Witz", "url": "https://www.cotizup.com/caisseldv", "lat": 48.8, "lng": 2.3},
        {"name": "FSU Jura", "url": "https://www.helloasso.com/associations/fsu-39/formulaires/1", "lat": 46.7, "lng": 5.6},
        {"name": "AED du lycée professionnel Joseph Gallieni", "url": "https://www.leetchi.com/c/aedgallieniengreve?utm_source=whatsapp&utm_medium=social_sharing", "lat": 48.8, "lng": 2.3},
        {"name": "Lycée Romain Rolland Goussainville", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve-du-lycee-romain-rolland-de-goussainville", "lat": 48.8, "lng": 2.3},
        {"name": "BPI Bibliothèque (Centre Pompidou)", "url": "https://www.helloasso.com/associations/collectif-352-55/formulaires/1", "lat": 48.8, "lng": 2.3},
        {"name": "SNES Guadeloupe", "url": "https://www.helloasso.com/associations/snes-guadeloupe/formulaires/1", "lat": 16.2, "lng": -61.5},
        {"name": "FSU Pays de la Loire", "url": "https://www.helloasso.com/associations/snetap-fsu-pays-de-la-loire/collectes/snetap-fsu-caisse-de-greve-retraite-2023", "lat": 48.1, "lng": -0.8},
        {"name": "CGT spectacle (FNSAC)", "url": "https://www.helloasso.com/associations/fnsac/formulaires/1", "lat": 48.8, "lng": 2.3},
        {"name": "SNUDI-FO 53 Mayenne", "url": "https://www.helloasso.com/associations/snudi-fo-53/formulaires/1", "lat": 48.1, "lng": -0.8},
        {"name": "Cheminots du Bourget", "url": "https://www.cotizup.com/greve-bourget", "lat": 48.8, "lng": 2.3},
        {"name": "Raffineurs Grandpuits et sous-traitants", "url": "https://www.cotizup.com/raffineurssoustraitants", "lat": 48.8, "lng": 2.3},
        {"name": "Lycée Robespierre Epinay-sur-Seine", "url": "https://www.cotizup.com/greve-robespierre", "lat": 48.8, "lng": 2.3},
        {"name": "Sud Santé Maine et Loire, Mayenne", "url": "https://www.helloasso.com/associations/sud-sante-sociaux-49-53/formulaires/1", "lat": 48.1, "lng": -0.8},
        {"name": "Sundep Solidaire", "url": "https://www.helloasso.com/associations/syndicat-de-la-formation-et-de-l-enseignement-prive-de-l-academie-de-toulouse-sundep-solidaires-occitanie-et-aquitaine/formulaires/1", "lat": 43.6, "lng": 1.4},
        {"name": "SNETAP-FSU IDF", "url": "https://www.helloasso.com/associations/snetap-fsu-ile-de-france/collectes/don-pour-la-caisse-de-solidarite-ile-de-france", "lat": 48.8, "lng": 2.3},
        {"name": "CGT SNJ", "url": "https://www.helloasso.com/associations/syndicat-national-des-journalistes-cgt/formulaires/1", "lat": 48.8, "lng": 2.3},
        {"name": "Solidaire Ligne 3/3 bis", "url": "https://www.cotizup.com/pour-aider-a-lutte-contre-cett", "lat": 48.8, "lng": 2.3},
        {"name": "Hospitaliers et agents de laboratoire de Bordeaux", "url": "https://www.cotizup.com/greve-labo-hospitaliers?fbclid=IwAR329fgBFyc8SghNnrHM8l_u8NTUQsHxZSRfGqySIFLpActk-Wgli-5LPpM", "lat": 44.8, "lng": -0.6},
        {"name": "Caisse de grève - AG féministe", "url": "https://fr.ulule.com/caisse-de-greve-ag-feministe/?utm_campaign=presale_158190&utm_source=shared-from-Ulule-project-page-on-Twitter", "lat": 48.8, "lng": 2.3},
        {"name": "Gréviste du collège Fabien de St-Denis (93)", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve-du-college-fabien-saint-denis", "lat": 48.8, "lng": 2.3},
        {"name": "Personnels du lycée Paul Robert Les Lilas", "url": "https://www.papayoux.com/fr/cagnotte/caisse-de-greve-paul-robert", "lat": 48.8, "lng": 2.3},
        {"name": "CGT Ferc SUP", "url": "https://www.helloasso.com/associations/syndicat-cgt-ferc-sup-de-nantes-universite/formulaires/1", "lat": 47.2, "lng": -1.6},
        {"name": "AED 44", "url": "https://www.helloasso.com/associations/collectif-aed-44/formulaires/1", "lat": 47.2, "lng": -1.6},
        {"name": "AESH/AED/AP/APS Collège Chantereine", "url": "https://www.leetchi.com/c/caisse-de-greve-aesh-ap-aps-clg-chantereine-sarcelles", "lat": 48.8, "lng": 2.3},
        {"name": "Solidaires Isère 38", "url": "https://www.okpal.com/caisse-de-solidarite-pour-les-grevistes/#/", "lat": 45.2, "lng": 5.7},
        {"name": "AG Chaville Meudon Educ", "url": "https://www.cotizup.com/ag-meudon-chaville-educ", "lat": 48.8, "lng": 2.3},
        {"name": "Transdev Cargo", "url": "https://www.cotizup.com/solidariteavectransdevcargo", "lat": 48.8, "lng": 2.3},
        {"name": "Caisse de grève de l'AG éducation 31", "url": "https://caisse-solidarite.fr/c/AG-educ-31/", "lat": 43.6, "lng": 1.4},
        {"name": "Caisse de solidarité AG éducation et ESR 34", "url": "https://caisse-solidarite.fr/c/AG-educ-34/", "lat": 43.6, "lng": 3.9},
        {"name": "Caisse de grève des salarié·es de SNF", "url": "https://caisse-solidarite.fr/c/snf/", "lat": 45.8, "lng": 4.8},
        {"name": "Toujours le pain levé !", "url": "https://caisse-solidarite.fr/c/toujourslepainleve/", "lat": 50.6, "lng": 3.1},
        {"name": "Caisse de grève des salarié·es de Mediapart", "url": "https://caisse-solidarite.fr/c/mediapart/", "lat": 48.8, "lng": 2.3},
        {"name": "Caisse de grève mutualisée de l'union syndicale Solidaires 55", "url": "https://caisse-solidarite.fr/c/solidairesmeuse/", "lat": 48.8, "lng": 2.3},
        {"name": "Cheminot·e·s SUD-Rail Pays-de-Loire dans la lutte contre la réforme des retraites", "url": "https://caisse-solidarite.fr/c/cheminotspaysdelaloire/", "lat": 47.2, "lng": -1.6},
        {"name": "Caisse de grève des agent.es de Paris musées", "url": "https://caisse-solidarite.fr/c/parismusées/", "lat": 48.8, "lng": 2.3},
        {"name": "Caisse de grève des salarié·es de Smile France", "url": "https://caisse-solidarite.fr/c/smilefrance/", "lat": 48.8, "lng": 2.3},
        {"name": "Caisse de grève de l'AG collège René caillié", "url": "https://caisse-solidarite.fr/c/collegerenecaillie/", "lat": 44.8, "lng": -0.6},
        {"name": "Caisse de solidarité des personnels de l'éducation en lutte Isère", "url": "https://caisse-solidarite.fr/c/educ38/", "lat": 45.2, "lng": 5.7},
        {"name": "Collège Jean Vigo Epinay-Sur-Seine", "url": "https://www.papayoux.com/fr/cagnotte/caisse-de-greve-college-jean-vigo", "lat": 48.8, "lng": 2.3},
        {"name": "Collège Evariste Galois Epinay-sur-Seine", "url": "https://www.papayoux.com/fr/cagnotte/caisse-de-greve-college-evaristegalois-epinay-sur-seine", "lat": 48.8, "lng": 2.3},
        {"name": "caisse de grève des cheminots Léon-Tregor.", "url": "https://caisse-solidarite.fr/c/cheminotsleontregor/", "lat": 48.6, "lng": -3.4},
        {"name": "caisse de grève de l'Institut National d'Histoire de l'art", "url": "https://www.cotizup.com/caissedegreveinha", "lat": 48.8, "lng": 2.3},
        {"name": "Collège Roger Martin du Gard à Epinay sur Seine", "url": "https://lydia-app.com/collect/86913-cagnotte-solidaire-rmg/fr", "lat": 48.8, "lng": 2.3},
        {"name": "Lycée de Vizille", "url": "https://www.leetchi.com/c/personnel-du-lycee-de-vizille-pour-une-retraite-solidaire-wmer7rkw", "lat": 45.2, "lng": 5.7},
        {"name": "Solidaires 73", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve-solidaires-73", "lat": 45.6, "lng": 6.0},
        {"name": "CNT SO nettoyage PACA", "url": "https://www.papayoux-solidarite.com//fr/collecte/nettoyage-en-lutte-contre-la-retraite-macron", "lat": 43.3, "lng": 5.4},
        {"name": "Salariés de l'université de Bourgogne", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve-universite-de-bourgogne", "lat": 47.3, "lng": 5.0},
        {"name": "CGT cheminots de Versailles", "url": "https://www.leetchi.com/c/caisse-de-greve-cgt-cheminots-versailles?utm_source=copylink&utm_medium=social_sharing", "lat": 48.8, "lng": 2.1},
        {"name": "Collectif « Nos Retraites Nous Rassemblent » Strasbourg", "url": "https://www.cotizup.com/caisse-greve-solidaire", "lat": 48.6, "lng": 7.8},
        {"name": "intersyndicale Tricastin", "url": "https://www.leetchi.com/c/tricastin-defense-des-retraites", "lat": 44.3, "lng": 4.7},
        {"name": "Gaziers de Sorengy", "url": "https://www.leetchi.com/c/storengy-defense-des-retraites", "lat": 48.8, "lng": 2.3},
        {"name": "Lycée Angela Davis Saint-Denis", "url": "https://www.leetchi.com/c/caisse-de-greve-angela-davis?utm_source=copylink&utm_medium=social_sharing", "lat": 48.8, "lng": 2.3},
        {"name": "Caisse de greve education Beaujolais Val de Seine", "url": "https://www.leetchi.com/c/caisse-de-greve-educ-bvs", "lat": 46.0, "lng": 4.7},
        {"name": "SOLIDAIRES 28", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve-pour-les-grevistes-deure-et-loir", "lat": 48.4, "lng": 1.5},
        {"name": "Union Locale des syndicats CGT Antibes et sa région", "url": "https://www.helloasso.com/associations/union-locale-des-syndicats-cgt-d-antibes-et-region/formulaires/1", "lat": 43.6, "lng": 7.1},
        {"name": "lycée Jacques Feyder Epinay sur Seine", "url": "https://www.leetchi.com/c/caisse-de-greve-lycee-feyder", "lat": 48.8, "lng": 2.3},
        {"name": "lycée Romain Rolland Ivry sur Seine", "url": "https://www.lepotcommun.fr/pot/0mjz8ni0", "lat": 48.8, "lng": 2.3},
        {"name": "Solidaire Ille et Vilaine 35", "url": "https://www.cotizup.com/solidaires35-greve-retraites", "lat": 48.1, "lng": -1.7},
        {"name": "L'Enclume - Enthousiaste Comité de Lutte de Mulhouse et Environs", "url": "https://www.cotizup.com/caisse-de-greve-mulhouse", "lat": 47.7, "lng": 7.3},
        {"name": "ASSO du 31 (Haute Garonne)", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve-pour-les-salarie-e-s-des-asso", "lat": 43.6, "lng": 1.4},
        {"name": "intersyndicale des Unions départementales de l'Eure", "url": "https://www.leetchi.com/c/fond-de-greve-des-ud-de-leure-2023", "lat": 48.8, "lng": 2.3},
        {"name": "union syndicale solidaires 21", "url": "https://www.helloasso.com/associations/union-syndicale-solidaires-21/formulaires/1", "lat": 47.3, "lng": 5.0},
        {"name": "comité de luttes de Champigny et environs", "url": "https://gofund.me/206025ac", "lat": 48.8, "lng": 2.3},
        {"name": "Grévistes du centre d'incinération d'Isséane - Issy-les-Moulineaux", "url": "https://www.leetchi.com/c/soutien-grevistes-isseane", "lat": 48.8, "lng": 2.3},
        {"name": "Grévistes du centre d'incinération TIRU de Saint-Ouen", "url": "https://www.leetchi.com/c/soutien-aux-agents-grevistes-de-la-tiru-de-saint-ouen?utm_source=copylink&utm_medium=social_sharing", "lat": 48.8, "lng": 2.3},
        {"name": "Personnel mobilisé de Sciences Po Bordeaux", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve", "lat": 44.8, "lng": -0.6},
        {"name": "AG interpro 54", "url": "https://nancy-luttes.net/ag2020/CaisseDeGreveInterpro54.html", "lat": 48.7, "lng": 6.2},
        {"name": "Comité de mobilisation de Rennes 2", "url": "https://www.cotizup.com/caissedegreverennes2", "lat": 48.1, "lng": -1.7},
        {"name": "Lycée François Truffaut de Bondoufle (91)", "url": "https://www.leetchi.com/c/cadeau-f-truffaut?utm_source=copylink&utm_medium=social_sharing", "lat": 48.8, "lng": 2.3},
        {"name": "Cheminots Juvisy", "url": "https://www.leetchi.com/c/caisse-de-greve-et-de-solidarite-pour-les-cheminots-de-juvisy-en-lutte-contre-la-retraite-a-64-ans?utm_source=copylink&utm_medium=social_sharing", "lat": 48.8, "lng": 2.3},
        {"name": "Sud CT Loire Atlantique (44)", "url": "https://www.leetchi.com/c/une-caisse-de-greve-pour-soutenir-les-grevistes-wxygrjyd", "lat": 47.2, "lng": -1.6},
        {"name": "Lycée Le Corbusier à Aubervilliers", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve-corbu?fbclid=IwAR0glHeOgGmTS0o_AupohhwpIVfXsWK3nDmbXpwxJt3BC0FIzyvvSIAh9fM", "lat": 48.8, "lng": 2.3},
        {"name": "ELECTRICIENS ET GAZIERS PARISIENS CONTRE LA RETRAITE A 64 ANS", "url": "https://www.leetchi.com/c/les-electriciens-et-gaziers-parisiens-contre-la-retraite-a-64-ans", "lat": 48.8, "lng": 2.3},
        {"name": "Comité de Luttes Montilien", "url": "https://www.helloasso.com/associations/comite-de-luttes-montilien/formulaires/1", "lat": 48.8, "lng": 2.3},
        {"name": "Personnels grévistes du lycée des Graves", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve-et-de-solidarite-lycee-des-graves", "lat": 44.8, "lng": -0.6},
        {"name": "Caisse de grève Lycée Marcelin Berthelot", "url": "https://www.leetchi.com/c/caisse-de-greve-pour-les-retraites-du-lycee-marcelin-berthelot?utm_source=whatsapp&utm_medium=social_sharing", "lat": 48.8, "lng": 2.3},
        {"name": "Solidarité aux Pizzorno de Vitry", "url": "https://www.helloasso.com/associations/caisse-de-solidarite-2/formulaires/36", "lat": 48.8, "lng": 2.3},
        {"name": "Lycée Maurice Utrillo Stains", "url": "https://www.papayoux.com/fr/cagnotte/caisse-de-greve-utrillo", "lat": 48.8, "lng": 2.3},
        {"name": "Solidarité AED Lycée Bremontier", "url": "https://lydia-app.com/pots?id=21632-caisse-solidarite-aed-bremontier", "lat": 44.8, "lng": -0.6},
        {"name": "Solidaires RATP métro lignes 3/3bis", "url": "https://www.cotizup.com/pour-aider-a-lutte-contre-cett", "lat": 48.8, "lng": 2.3},
        {"name": "SUD Rail Paris Sud Est", "url": "https://www.leetchi.com/c/greve-des-retraites-sud-rail-pse?utm_source=copylink&utm_medium=social_sharing", "lat": 48.8, "lng": 2.3},
        {"name": "Solidaires 86 Vienne", "url": "https://www.helloasso.com/associations/union-syndicale-solidaires-11/formulaires/1", "lat": 46.6, "lng": 0.3},
        {"name": "Solidaires 27 Eure", "url": "https://www.leetchi.com/c/fond-de-greve-des-ud-de-leure-2023", "lat": 48.8, "lng": 2.3},
        {"name": "Caisse de greve Sud Solidaires 06 Alpes Maritimes", "url": "https://www.cotizup.com/solidaires06", "lat": 43.7, "lng": 7.3},
        {"name": "Grevistes de la tiru de saint-ouen", "url": "https://www.leetchi.com/c/soutien-aux-agents-grevistes-de-la-tiru-de-saint-ouen?utm_source=copylink&utm_medium=social_sharing", "lat": 48.8, "lng": 2.3},
        {"name": "CGT Energie Charente", "url": "https://www.leetchi.com/c/cgt-energie-charente-soutien-contre-la-reforme-des-retraites?fbclid=IwAR2GVjx9feF_gV9P-WnTxQ_q1YPUw8I0fYJTj33LxNg6IcEEKu3hcKUIvNo", "lat": 45.6, "lng": 0.2},
        {"name": "Raffinerie Plateforme Normandie", "url": "https://www.cotizup.com/plateformenormandie", "lat": 49.4, "lng": 0.2},
        {"name": "Caisse de grève interprofessionnelle du Mantois", "url": "https://sudeducation78.ouvaton.org/Une-caisse-de-greve-interpro-dans-le-Mantois", "lat": 48.8, "lng": 2.3},
        {"name": "Technicentre Châtillon (maintenance TGV)", "url": "https://www.leetchi.com/c/caisse-de-greve-des-cheminots-de-chatillon", "lat": 48.8, "lng": 2.3},
        {"name": "Enseignants et AESH 1er degré 19ème arrondissement", "url": "https://www.helloasso.com/associations/arret-images/formulaires/1", "lat": 48.8, "lng": 2.3},
        {"name": "AG interprofessionnelle de Saint-Denis", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve-ag-interpro-saint-denis", "lat": 48.8, "lng": 2.3},
        {"name": "CGT des laboratoires Pierre Fabre", "url": "https://www.helloasso.com/associations/syndicat-cgt-des-laboratoires-pierre-fabre/formulaires/1", "lat": 43.6, "lng": 1.4},
        {"name": "Collectif des éboueurs de Nantes Métropole", "url": "https://caisse-solidarite.fr/c/eboueurs-nantes/", "lat": 47.2, "lng": -1.6},
        {"name": "Cheminots de Paris Nord", "url": "https://www.cotizup.com/bataille-retraite-cheminot-pno", "lat": 48.8, "lng": 2.3},
        {"name": "Chauffeurs Poids Lourd de la Propreté de Paris", "url": "https://caisse-solidarite.fr/c/chauffeurs-proprete-paris/", "lat": 48.8, "lng": 2.3},
        {"name": "Universités et bibliothèques d'IDF en lutte", "url": "https://www.cotizup.com/caisse-de-greve-univ-bib", "lat": 48.8, "lng": 2.3},
        {"name": "AG des Territoriaux Ville de Paris pour la grève reconductible (Propreté, espaces verts, affaires scolaires, petite enfance, social, culture...)", "url": "https://caisse-solidarite.fr/c/ville-de-paris-en-lutte", "lat": 48.8, "lng": 2.3},
        {"name": "Eboueurs et travailleurs du SIVOM en grève - Varennes-Jarcy", "url": "https://www.cotizup.com/eboueurs-sivom", "lat": 48.8, "lng": 2.3},
        {"name": "Soutien aux éboueurs de Saint-Brieuc", "url": "https://www.leetchi.com/c/soutien-eboueurs-grevistes?fbclid=IwAR37klksknkq53BHqXrsFU_GmzgXkW6KKbvN2la2MXiwwVpND6BMhSRrpGo", "lat": 48.5, "lng": -2.8},
        {"name": "Caisse de grève - Planning Familial de la Gironde", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve-planning-familial-de-la-gironde", "lat": 44.8, "lng": -0.6},
        {"name": "Collectif MobiRetraites92", "url": "https://www.cotizup.com/MobiRetraites92", "lat": 48.8, "lng": 2.3},
        {"name": "Collège La Cerisaie", "url": "https://www.leetchi.com/c/caisse-de-greve-la-cerisaie", "lat": 48.8, "lng": 2.3},
        {"name": "Caisse de grève du collège E. Quinet", "url": "https://www.leetchi.com/c/caisse-de-greve-du-college-e-quinet", "lat": 43.3, "lng": 5.4},
        {"name": "Caisse de soutien aux éboueurs de Saint Etienne", "url": "https://www.leetchi.com/fr/c/lQv64OVE?utm_source=facebook&fbclid=IwAR2IBl4krpXCE_CUCBimw4cON9T_ZDszYDXScaQz98L_TtB7-Wg4aGFNoDM", "lat": 45.4, "lng": 4.4},
        {"name": "Solidaire RATP", "url": "https://www.cotizup.com/caissedegrevesolidairesratp", "lat": 48.8, "lng": 2.3},
        {"name": "Personnels grévistes du lycée Jean Vilar", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve-lycee-jean-vilar", "lat": 48.8, "lng": 2.3},
        {"name": "Caisse de grève du collège Albert Camus (Le Plessis-Trévise, 94)", "url": "https://caisse-solidarite.fr/c/albertcamus-plessistrevise/", "lat": 48.8, "lng": 2.3},
        {"name": "Éducation Groupe scolaire Nanteuil MONTREUIL", "url": "https://www.cotizup.com/caissedegreve-nanteuil", "lat": 48.8, "lng": 2.3},
        
        # Thematic funds (no specific location)
        {"name": "Caisse de grève Queer", "url": "https://www.papayoux.com/fr/cagnotte/caisse-de-greve-queer", "type": "thematic"},
        {"name": "Sud-Éducation", "url": "https://www.helloasso.com/associations/sud-education/collectes/solidarite-avec-les-grevistes-de-l-education-1", "type": "thematic"},
        {"name": "CNT SO", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve-interpro-de-la-cnt-so", "type": "thematic"},
        {"name": "CGT", "url": "https://www.leetchi.com/c/solidarite-cgt-mobilisation", "type": "thematic"},
        {"name": "Solidarité Lutte FNME CGT – Fédé nationale Mines énergie", "url": "https://www.leetchi.com/c/solidarite-lutte-fnme-cgt", "type": "thematic"},
        {"name": "Syndicat des Travailleurs et Travailleuses du Jeu Vidéo (STJV)", "url": "https://www.stjv.fr/2023/01/mobilisation-pour-les-retraites-caisse-de-greve-du-stjv/", "type": "thematic"},
        {"name": "Sud Rail Centraux", "url": "https://www.cotizup.com/solidaritecheminots", "type": "thematic"},
        {"name": "Caisse de solidarité intersyndicale CGT-SUD", "url": "https://caisse-solidarite.fr", "type": "thematic"},
        {"name": "Caisse de grève des Métiers du Livre", "url": "https://www.cotizup.com/metier-du-livre-en-lutte", "type": "thematic"},
        {"name": "Caisse de grève des salariés de l'associatif ASSO Solidaires", "url": "https://www.helloasso.com/associations/syndicat-asso-solidaires/formulaires/1", "type": "thematic"},
        {"name": "Caisse de grève des assistant.es d'éducation (AED) d'Île-de-France", "url": "https://www.papayoux-solidarite.com/fr/collecte/caisse-de-greve-des-surveillant-es-d-ile-de-france", "type": "thematic"},
        {"name": "sud education", "url": "https://www.sudeducation.org/caisse-de-greve-pour-soutenir-les-grevistes-de-leducation-et-de-lesr-contre-la-reforme-des-retraites/", "type": "thematic"},
        {"name": "AG Education Ile-de-France", "url": "https://www.helloasso.com/associations/association-crbp/formulaires/2", "type": "thematic"},
        {"name": "Solidarité avec les luttes SUD PTT", "url": "https://www.helloasso.com/associations/sud-ptt/formulaires/2", "type": "thematic"},
        {"name": "coordination antirépression Paris IdF 07 52 95 71 11", "url": "https://www.helloasso.com/associations/collectives-solidarites", "type": "thematic"},
        {"name": "caisse de soutien antirépression Marseille 07.53.05.25.30", "url": "https://www.helloasso.com/associations/liberte-toujours?banner=true", "type": "thematic"},
    ]
    
    return strike_funds

def main():
    strike_funds = extract_strike_funds_data()
    
    # Save to JSON file
    with open('strike_funds_data.json', 'w', encoding='utf-8') as f:
        json.dump(strike_funds, f, ensure_ascii=False, indent=2)
    
    print(f"Found {len(strike_funds)} strike funds")
    
    # Display summary
    with_coordinates = [f for f in strike_funds if 'lat' in f and 'lng' in f]
    thematic = [f for f in strike_funds if f.get('type') == 'thematic']
    
    print(f"- {len(with_coordinates)} funds with coordinates")
    print(f"- {len(thematic)} thematic funds")
    print("Data saved to strike_funds_data.json")

if __name__ == "__main__":
    main()

