export default interface qParams {
    base_query?: string;     // base query to add filters to
    hashtags?: string[];     // array of hashtags, the # is added if not present
    author?: string;         // author name
    since?: string;          // since date, "yyyy-mm-dd" format
    until?: string;          // until date, same format
    remove?: string[];       // array of words to be filtered out
};
