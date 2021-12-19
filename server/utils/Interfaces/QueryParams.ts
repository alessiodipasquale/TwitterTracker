/**
 * Interface that contains all standard queries fields
 */

export default interface queryParams {
    keywords?: string;     // base query to add filters to
    hashtags?: string[];     // array of hashtags, the # is added if not present
    from?: string;         // author name
    exclude?: string[];       // array of words to be filtered out
    attitude?: string;
    point_radius?: string;
}
