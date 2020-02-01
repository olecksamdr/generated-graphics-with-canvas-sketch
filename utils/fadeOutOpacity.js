const fadeOutOpacity = (progress, boundary) =>
  progress < boundary ? progress / boundary : 1

export default fadeOutOpacity;
