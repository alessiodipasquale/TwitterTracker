import qParams from "./Interfaces/QueryParams"

/* Builds the q field */
export function buildQ(q: qParams): string {
  
    let query = q.keywords || "";
  
    // if (q.hashtags){
    //   for (var i = 0; i < q.hashtags.length; i++){
    //     if (q.hashtags[i].indexOf('#') == -1) {
    //       q.hashtags[i] = "#".concat(q.hashtags[i]);
    //     }
    //   }
    // }

    // q.hashtags && q.hashtags.forEach(element => {
    //   if(element)
    //     query = query.concat("#").concat(element).concat(" ")
    // });
  
  
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