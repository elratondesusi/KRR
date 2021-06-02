# pip3 install requests
# https://github.com/RDFLib/rdflib
import requests
import json
import rdflib
from rdflib.namespace import XSD, RDFS


class RDF:
    def __init__(self):
        self.g = rdflib.Graph()
        self.SM = rdflib.Namespace('http://sm.org/onto/')
        self.DBO = rdflib.Namespace('https://dbpedia.org/ontology/')
        self.g.bind("dbo", self.DBO)
        self.g.bind("xsd", XSD)
        self.g.bind("sm", self.SM)
        self.data = None
        self.API_KEY = 'd856d5f9cb33692ee1fff156afd22229'

    def get_movie(self, id):
        # https://api.themoviedb.org/3/movie/567189?api_key=d856d5f9cb33692ee1fff156afd22229&language=en-US
        link = 'https://api.themoviedb.org/3/movie/' + str(id) + '?api_key=' + self.API_KEY + '&language=en-US'
        resposne = self.send_requests(link)
        return resposne.json() if resposne is not None else None

    def get_credits(self, movie_id):
        # https://api.themoviedb.org/3/credit/{credit_id}?api_key=<<api_key>>
        link = 'https://api.themoviedb.org/3/movie/' + str(movie_id) + '/credits?api_key=' + self.API_KEY + '&language=en-US'
        resposne = self.send_requests(link)
        return resposne.json() if resposne is not None else None

    def get_director(self, movie_id):
        film_credits = self.get_credits(movie_id)
        if(film_credits is None):
            return None
        # find first person that has job of director
        for person in film_credits["crew"]:
            if "job" in person:
                if person["job"] == "Director":
                    return person
        return None

    def send_requests(self, link):
        response = requests.get(link)
        if response.status_code == 200:
            return response
        return None

    def download_data(self):
        what = 'movie'
        sort_by = 'popularity.desc'
        self.data = []
        for i in range(50):
            page = str(i)
            link = 'https://api.themoviedb.org/3/discover/' + what + '?api_key=' + self.API_KEY + '&language=en-US&sort_by=' + sort_by + '&include_adult=false&include_video=false&page=' + page + '&with_watch_monetization_types=flatrate'
            response = self.send_requests(link)
            if response is not None:
                with open('data_' + what + '_' + page + '.json', 'w') as f:
                    json.dump(response.json(), f)
                self.data += response.json()['results']


    def jozko(self, row):
        if row["id"] is not None:
            director = self.get_director(row["id"])
            if director is not None:
                self.create_object_property(self.SM + 'Film/' + str(row["id"]), self.SM.directedBy, self.SM + "Person/" + str(director["id"]))
                self.create_object_property(self.SM + 'Person/' + str(director["id"]), RDFS.Class, self.SM["Director"])
                if director["name"] is not None:
                    self.create_data_property(self.SM + 'Person/' + str(director["id"]), self.SM.hasName, director["name"], XSD.string)

            if "original_title" in row:
                self.create_data_property(self.SM + 'Film/' +str(row["id"]), self.SM.hasName, row["original_title"], XSD.string)


    def zuzka(self, row):
        if "id" in row:
            self.create_object_property(self.SM + 'Film/' + str(row["id"]), RDFS.Class, self.SM["Film"])
            if "homepage" in row:
                self.create_data_property(self.SM + 'Film/' + str(row["id"]), self.SM.hasHomepage, row["homepage"], XSD.int)
            if "release_date" in row:
                self.create_data_property(self.SM + 'Film/' + str(row["id"]), self.SM.releasedIn, row["release_date"], XSD.dateTime)
            if "adult" in row:
                self.create_data_property(self.SM + 'Film/' + str(row["id"]), self.SM.isAdultFilm, row["adult"], XSD.boolean)
            if "runtime" in row:
                self.create_data_property(self.SM + 'Film/' + str(row["id"]), self.SM.hasRuntime, row["runtime"], XSD.int)
            if "vote_average" in row:
                self.create_data_property(self.SM + 'Film/' + str(row["id"]), self.SM.hasRanking, row["vote_average"], XSD.float)
            if "budget" in row:
                self.create_data_property(self.SM + 'Film/' + str(row["id"]), self.SM.hasBudget, row["budget"], XSD.float)
            if "poster_path" in row:
                self.create_data_property(self.SM + 'Film/' + str(row["id"]), self.SM.hasPoster, row["poster_path"], XSD.anyURI)
            if "overview" in row:
                self.create_data_property(self.SM + 'Film/' + str(row["id"]), self.SM.hasAbstract, row["overview"], XSD.string)
            if "production_countries" in row:
                for country in row["production_countries"]:
                    if "iso_3166_1" in country:
                        self.create_object_property(self.SM + 'Country/' + country["iso_3166_1"], RDFS.Class, self.SM["Country"])
                        if "name" in country:
                            self.create_data_property(self.SM + 'Country/' + country["iso_3166_1"], self.SM.hasName, country["name"], XSD.string)
                        self.create_object_property(self.SM + 'Film/' + str(row["id"]), self.SM.hasOriginCountry, self.SM + 'Country/' + country["iso_3166_1"])
            if "production_countries" in row:
                for film_studio in row["production_companies"]:
                    if "id" in film_studio:
                        film_studio_id = str(film_studio["id"])
                        self.create_object_property(self.SM + 'FilmStudio/' + film_studio_id, RDFS.Class, self.SM["FilmStudio"])
                        if "name" in film_studio:
                            self.create_data_property(self.SM + 'FilmStudio/' + film_studio_id, self.SM.hasName, film_studio["name"], XSD.string)
                        if "logo_path" in film_studio:
                            self.create_data_property(self.SM + 'FilmStudio/' + film_studio_id, self.SM.hasLogo, film_studio["logo_path"], XSD.anyURI)
                        if "homepage" in film_studio:
                            self.create_data_property(self.SM + 'FilmStudio/' + film_studio_id, self.SM.hasHomepage, film_studio["homepage"], XSD.anyURI)
                        if "origin_country" in film_studio:
                            self.create_object_property(self.SM + 'FilmStudio/' + film_studio_id, self.SM.hasOriginCountry, self.SM + 'Country/' + film_studio["origin_country"])
                        self.create_object_property(self.SM + 'Film/' + str(row["id"]), self.DBO.ProducedBy, self.SM + 'FilmStudio/' + film_studio_id)
            if "genres" in row:
                for genre in row["genres"]:
                    self.create_object_property(self.SM + 'Film/' + str(row["id"]), RDFS.Class, self.SM[genre["name"].replace(" ", "")])

            self.create_actor_node(row["id"])


    #Iveta a Nikolaj !!!!!

    def get_actors(self, movie_id):
        film_credits = self.get_credits(movie_id)
        if(film_credits is None):
            return None
        return film_credits["cast"]

    def get_actor_details(self, actor_id):
        # https://api.themoviedb.org/3/credit/{credit_id}?api_key=<<api_key>>
        link = 'https://api.themoviedb.org/3/person/' + str(actor_id) + '?api_key=' + self.API_KEY + '&language=en-US'
        response = self.send_requests(link)
        return response.json() if response is not None else None

    def get_actor_photo(self, actor_id):
        # https://api.themoviedb.org/3/credit/{credit_id}?api_key=<<api_key>>
        link = 'https://api.themoviedb.org/3/person/' + str(actor_id) + '/images?api_key=' + self.API_KEY + '&language=en-US'
        response = self.send_requests(link)
        return response.json() if response is not None else None

    def get_photo_file_path(self, actor_id):
        image = self.get_actor_photo(actor_id)
        if(image is None):
            return None
        for photo in image["profiles"]:
            return photo
        return None

    def create_actor_node(self, movie_id):
        actors = self.get_actors(movie_id)
        for actor in actors:
            if "id" in actor:

                details = self.get_actor_details(actor["id"])
                self.create_object_property(self.SM + 'Person/' + str(actor["id"]), RDFS.Class, self.SM["Actor"])
                self.create_object_property(self.SM + 'Film/' + str(movie_id), self.SM.starring, self.SM + 'Person/' + str(actor["id"]))
                self.create_object_property(self.SM + 'Person/' + str(actor["id"]), self.SM.starsIn, self.SM + 'Film/' + str(movie_id))

                if "birthday" in details:
                    self.create_data_property(self.SM + 'Person/' + str(actor["id"]), self.SM.hasBirthDate, details["birthday"], XSD.dateTime)
                if "deathday" in details:
                    self.create_data_property(self.SM + 'Person/' + str(actor["id"]), self.SM.hasDeathDate, details["deathday"], XSD.dateTime)
                if "name" in details:
                    self.create_data_property(self.SM + 'Person/' + str(actor["id"]), self.SM.hasName, details["name"], XSD.string)
                    self.create_data_property(self.SM + 'Person/' + str(actor["id"]), self.SM.hasBiography, details["biography"], XSD.string)
                if "popularity" in details:
                    self.create_data_property(self.SM + 'Person/' + str(actor["id"]), self.SM.hasPopularity, details["popularity"], XSD.float)
                if "place_of_birth" in details:
                    self.create_data_property(self.SM + 'Person/' + str(actor["id"]), self.SM.hasBirthPlace, details["place_of_birth"], XSD.string)

                photo = self.get_photo_file_path(actor["id"])
                if photo is not None and "file_path" in photo:
                    self.create_data_property(self.SM + 'Person/' + str(actor["id"]), self.SM.hasPhoto, photo["file_path"], XSD.anyURI)

    def process_row(self, row):
        self.jozko(row)

    def run(self):
        for row in self.data:
            if row["id"] is not None:
                self.process_row(self.get_movie(row["id"]))

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
        self.g.serialize(format="turtle", destination='output.ttl')


rdf = RDF()
rdf.download_data()
rdf.run()

rdf.save_graph()
