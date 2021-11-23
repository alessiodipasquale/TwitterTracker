import qParams from "./Interfaces/QueryParams"

/* Builds the q field */
export function buildQ(q: qParams): string {
  
    var query= "";
  
    if (q.base_query) query = q.base_query.concat(" ");
  
    if (q.hashtags){
      for (var i = 0; i < q.hashtags.length; i++){
        if (q.hashtags[i].indexOf('#') == -1) {
          q.hashtags[i] = "#".concat(q.hashtags[i]);
        }
      }

    // q.hashtags && q.hashtags.forEach(element => {
    //   if(element)
    //     query = query.concat("#").concat(element).concat(" ")
    // });
  
    }
  
    if (q.author) {
      query = query.concat(`from:${q.author} `);
    }
  
    if (q.since) {
      query = query.concat(`since:${q.since} `);
    }
  
    if (q.until) {
      query = query.concat(`until:${q.until} `);
    }
        
    q.remove && q.remove.forEach(element => {
      if (element)
        query = query.concat("-").concat(element).concat(" ")
    });
      


    // if (q.remove) {
    //   for (var i = 0; i < q.remove.length; i++){
    //     if (q.remove[i].indexOf('-') == -1) {
    //       q.remove[i] = "-".concat(q.remove[i]);
    //     }
    //   }
  
    //     query = query.concat(q.remove.join(" ")).concat(" ");
    // }

    if (q.attitude) {  
      query = query.concat(q.attitude).concat(" ");
    }
    return query;
  };