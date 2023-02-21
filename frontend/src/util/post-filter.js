export function postsFilter(
  posts,
  bounds,
  tags,
  dateFrom,
  dateTo,
  publishers,
  taggedUsers
) {
  let filtered = posts.filter((post) =>
    bounds.contains({ lat: post.lat, lng: post.lng })
  );
  if (tags.length > 0) {
    filtered = filtered.filter((post) =>
      post.tags.hashTags.some((tag) => tags.includes(tag))
    );
  }

  if (dateFrom && dateTo) {
    filtered = filtered.filter(
      (post) => new Date(post.time) >= dateFrom && new Date(post.time) <= dateTo
    );
  } else if (dateFrom && !dateTo) {
    filtered = filtered.filter((post) => new Date(post.time) >= dateFrom);
  } else if (!dateFrom && dateTo) {
    filtered = filtered.filter((post) => new Date(post.time) <= dateTo);
  }

  if (publishers) {
    const namesArr = publishers.split(",").filter((p) => p.trim() !== "");

    filtered = filtered.filter((post) =>
      namesArr.some(
        (v) =>
          post.publisher
            .toLowerCase()
            .trim()
            .includes(v.length > 0 ? v.trim().toLowerCase() : false) ||
          post.publisherName
            .toLowerCase()
            .trim()
            .includes(v.length > 0 ? v.trim().toLowerCase() : false)
      )
    );
  }

  if (taggedUsers) {
    const mentionArr = taggedUsers.split(",").filter((p) => p.trim() !== "");

    filtered = filtered.filter((post) =>
      mentionArr.some((v) =>
        post.tags.userTags.some((userTag) =>
          userTag
            .toLowerCase()
            .trim()
            .includes(v.length > 0 ? v.trim().toLowerCase() : false)
        )
      )
    );
  }

  return filtered;
}
