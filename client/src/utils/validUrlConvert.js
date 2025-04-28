export const validUrlConvert = (name) => {
  const url = name
    .toString()
    .replaceAll(" ", "-")
    .replace(",", "-")
    .replaceAll("&", "-");
  return url;
};
