#pip3 install requests
# https://github.com/RDFLib/rdflib
import requests
import json
import rdflib
from rdflib.namespace import XSD
#
# g = rdflib.Graph()
# SM = rdflib.Namespace('http://sm.org/onto/')
# DBO = rdflib.Namespace('https://dbpedia.org/ontology/')
#
# g.bind("foaf", FOAF)
# g.bind("xsd", XSD)
# g.bind("sm", SM)
# # discover = '/discover/movie?sort_by=popularity.desc'
# # link = "https://api.themoviedb.org/3/search/movie?api_key=d856d5f9cb33692ee1fff156afd22229&query=Titanic"
# # link = 'https://api.themoviedb.org/3/discover/movie?api_key=d856d5f9cb33692ee1fff156afd22229&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate'
#
#
# what = 'movie'
# api_key = 'd856d5f9cb33692ee1fff156afd22229'
# sort_by = 'popularity.desc'
# page = '1'
# link = 'https://api.themoviedb.org/3/discover/' + what + '?api_key=' + api_key + '&language=en-US&sort_by=' + sort_by + '&include_adult=false&include_video=false&page=' + page + '&with_watch_monetization_types=flatrate'
#
# response = requests.get(link)
#
# if response.status_code == 200:
#     with open('data_' + what + '_' + sort_by + '.json', 'w') as f:
#         json.dump(response.json(), f)
#
#     result = response.json()
#     print('size:', len(result['results']))
#     for i in result['results']:
#         print(i['original_title'])
#         g.add((
#             rdflib.URIRef("http://example.com/movie/" + str(i['id'])),
#             SM.hasTitle,
#             rdflib.Literal(i['original_title'], datatype=XSD.string)
#         ))
#         g.add((
#             rdflib.URIRef("http://example.com/movie/" + str(i['id'])),
#             SM.hasAbstract,
#             rdflib.Literal(i['overview'], datatype=XSD.string)
#         ))
#
#     # for i in g.serialize(format="turtle"):
#     #     print(i)
#
# g.serialize(format="turtle", destination='output.rdf')


class RDF:
    def __init__(self):
        self.g = rdflib.Graph()
        self.SM = rdflib.Namespace('http://sm.org/onto/')
        # self.DBO = rdflib.Namespace('https://dbpedia.org/ontology/')
        # self.g.bind("dbo", DBO)
        self.g.bind("xsd", XSD)
        self.g.bind("sm", self.SM)
        self.data = None

    def download_data(self):
        what = 'movie'
        api_key = 'd856d5f9cb33692ee1fff156afd22229'
        sort_by = 'popularity.desc'
        page = '1'
        link = 'https://api.themoviedb.org/3/discover/' + what + '?api_key=' + api_key + '&language=en-US&sort_by=' + sort_by + '&include_adult=false&include_video=false&page=' + page + '&with_watch_monetization_types=flatrate'

        response = requests.get(link)
        if response.status_code == 200:
            with open('data_' + what + '_' + page + '.json', 'w') as f:
                json.dump(response.json(), f)

            self.data = response.json()['results']

    def jozko(self, row):
        if row["id"] is not None:
            rdf.create_data_property(self.SM + 'Film/' + str(row["id"]), self.SM.hasName, row["original_title"], XSD.string)

    def zuzka(self, row):
        # if row["id"] is not None:
        #     rdf.create_data_property(self.SM + 'Film/' + str(row["id"]), self.SM.hasName, row["original_title"], XSD.string)
        pass

    def process_row(self, row):
        self.jozko(row)
        self.zuzka(row)

    def run(self):
        for row in self.data:
            self.process_row(row)


    def create_object_property(self, uri, property, uri2):
        self.g.add((
            rdflib.URIRef(uri),
            property,
            rdflib.URIRef(uri2),
        ))

    def create_data_property(self, uri, property, data, datatype):
        self.g.add((
            rdflib.URIRef(uri),
            property,
            rdflib.Literal(data, datatype=datatype)
        ))

    def save_graph(self):
        self.g.serialize(format="turtle", destination='output.rdf')


rdf = RDF()
rdf.download_data()
rdf.run()

rdf.save_graph()

# rdf.create_data_property(SM + 'Film/' + '1234', SM.hasTitle, 'Titanic', XSD.string)
# rdf.create_object_property(SM + 'Film/' + '1234', SM.producedBy, SM + '/FilmStudio/' + 'studio16')
