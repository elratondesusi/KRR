import logo from './logo.svg';
import './App.css';
import {SparqlEndpointFetcher} from "fetch-sparql-endpoint";


function App() {

  const fetcher = new SparqlEndpointFetcher();
  
  const RDFprefixes = `PREFIX dbo: <https://dbpedia.org/ontology/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
  PREFIX sm: <http://sm.org/onto/>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>`;

  const allMoviesQuery = `SELECT ?subject ?name ?picture 
  WHERE {
    ?subject rdfs:Class sm:Film; sm:hasName ?name; 
    OPTIONAL {?subject sm:hasPoster ?picture}}`;
  
  const oneMovieQueryNoGenreNoProducedBy = 
  `SELECT ?name ?poster ?budget ?homepage ?ranking ?runtime ?adult ?releasedId ?abstract ?directedBy (GROUP_CONCAT(?actorInfo;SEPARATOR=",") AS ?actors)
  WHERE {
    <http://sm.org/onto/Film/184315> rdfs:Class sm:Film;
             sm:hasName ?name. 
    OPTIONAL (<http://sm.org/onto/Film/184315> sm:hasPoster ?poster;
                       sm:hasBudget ?budget;
                       sm:hasHomepage ?homepage;
                       sm:hasRanking ?ranking;
                       sm:hasRuntime ?runtime;
                       sm:isAdultFilm ?adult;
                       sm:releasedIn ?releasedId;
                       sm:hasAbstract ?abstract;
                       sm:directedBy ?directedBy;
                       sm:starring ?starring.
          ?starring sm:hasName ?actorName)
      BIND (CONCAT(STR(?starring), " - ", ?actorName) AS ?actorInfo)
  }
  GROUP BY ?name ?poster ?budget ?homepage ?ranking ?runtime ?adult ?releasedId ?abstract ?directedBy`;
  
  const filmStudioQuery = `SELECT ?name 
  WHERE {
    <http://sm.org/onto/Film/184315> dbo:ProducedBy ?studio. 
    ?studio sm:hasName ?name.
  }`;

  const filmGenreQuery = `SELECT ?genre 
  WHERE {
    <http://sm.org/onto/Film/184315> rdfs:Class ?genre. 
    FILTER (?genre != sm:Film)
  }`;

  const filmsByActor = `SELECT ?filmName ?poster ?budget ?homepage ?ranking ?runtime ?adult ?releasedId ?abstract ?directedBy
    ?photo ?actorName ?birthDate ?deathDate ?popularity
  WHERE {
          <http://sm.org/onto/Person/1504807> rdfs:Class sm:Actor;
                                              sm:starsIn ?Film. 
          OPTIONAL {<http://sm.org/onto/Person/1116982> sm:hasPhoto ?photo.           }
          OPTIONAL {<http://sm.org/onto/Person/1116982> sm:hasName ?actorName.        }
          OPTIONAL {<http://sm.org/onto/Person/1116982> sm:hasBirthDate ?birthDate.   }
          OPTIONAL {<http://sm.org/onto/Person/1116982> sm:hasDeathDate ?deathDate.   }  
          OPTIONAL {<http://sm.org/onto/Person/1116982> sm:hasPopularity ?popularity. }             
          
          OPTIONAL {   ?Film sm:hasName ?filmName.     }
          OPTIONAL {   ?Film sm:hasPoster ?poster.     }
          OPTIONAL {   ?Film sm:hasBudget ?budget.     }
          OPTIONAL {   ?Film sm:hasHomepage ?homepage. }
          OPTIONAL {   ?Film sm:hasRanking ?ranking.   }
          OPTIONAL {   ?Film sm:hasRuntime ?runtime.   }
          OPTIONAL {   ?Film sm:isAdultFilm ?adult.    }
          OPTIONAL {   ?Film sm:releasedIn ?releasedId.}
          OPTIONAL {   ?Film sm:hasAbstract ?abstract. }
          OPTIONAL {   ?Film sm:directedBy ?directedBy.}
          OPTIONAL {   ?Film sm:starring ?starring.    }
  }
  GROUP BY ?filmName ?poster ?budget ?homepage ?ranking ?runtime ?adult ?releasedId ?abstract ?directedBy ?photo ?actorName ?birthDate ?deathDate ?popularity`;

  (async () => {
    try{
    const bindingsStream = await fetcher.fetchBindings('http://localhost:3030/Movies/sparql', RDFprefixes + filmGenreQuery) ;
    //const bindingsStream = await fetcher.fetchBindings('https://dbpedia.org/sparql', 'SELECT * WHERE { ?s ?p ?o } LIMIT 100');
    bindingsStream.on('data', (bindings) => console.log(bindings));
    }catch(error){
      console.log(error)
    }
  })()
 

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
