// add custom Next tags
interface NextFetchRequestConfig {
  tags?: Array<"test" | "yo" | (string & { _?: never })>;
}
