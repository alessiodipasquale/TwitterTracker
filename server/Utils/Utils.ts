import qParams from "./Interfaces/QueryParams"

/* Builds the q field */
export function buildQ(q: qParams): string {
  
    let query = q.keywords || ""; 
  
    q.from && (query += " from:" + q.from)
        
    q.exclude && q.exclude.forEach(element => {
      if (element)
        query = query.concat("-").concat(element).concat(" ")
    });

    q.point_radius && (query += " point_radius:" + q.point_radius)

    if (q.attitude) {  
      query = query.concat(q.attitude).concat(" ");
    }
    
    return query;
  };

  export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }