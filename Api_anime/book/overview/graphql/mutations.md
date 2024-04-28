# Mutations

Mutations allow you create, update, and delete data.

As they require user authentication they also require OAuth.

The majority of our mutations have the following prefixes:

* **Save** - Create or Update. We usually determine if you would like to create or update data depending on if you provide a valid `id` argument.
* **Delete** - Delete. This will usually return a `Deleted` object type, however, some mutations will return an updated version of the sibling data if this is more useful.
* **Toggle** - Toggle a boolean state, such as following or unfollowing a user.

Like a query, mutations allow you to specify which fields you would like to be returned from the updated object.

### Let's create a mutation to add an anime to the user's anime list. We'll use Cowboy Bebop \(id: 1\) in this example.

You'll also need to include your Authorization header with the user's access token, but we'll skip that for these examples.

```php
$query = '
mutation ($mediaId: Int, $status: MediaListStatus) {
    SaveMediaListEntry (mediaId: $mediaId, status: $status) {
        id
        status
    }
}
';

$variables = [
    "mediaId" => 1,
    "status" => "CURRENT"
];

$http = new GuzzleHttp\Client;
$response = $http->post('https://graphql.anilist.co', [
    'json' => [
        'query' => $query,
        'variables' => $variables,
    ]
]);
```

This request will return the following JSON response, which we can get the new id and values from.

```text
"data": {
    "SaveMediaListEntry": {
        "id": 4,
        "status": "CURRENT"
    }
  }
}
```

## Now we have the list entry id, lets make a request to update the list entry.

```php
$query = '
mutation ($id: Int, $mediaId: Int, $status: MediaListStatus) {
    SaveMediaListEntry (id: $id, mediaId: $mediaId, status: $status) {
        id
        status
    }
}
';

$variables = [
    "id" => $id,
    "status" => "COMPLETED"
];

$http = new GuzzleHttp\Client;
$response = $http->post('https://graphql.anilist.co', [
    'json' => [
        'query' => $query,
        'variables' => $variables,
    ]
]);
```

{% hint style="info" %}
Note that we've left the $mediaId variable in the mutation but not included it in our variables array.  
This is valid and the AniList GraphQL server will simply ignore any variables in the mutation that are not included in the variables object.  
This can allow you to make more complex and flexible mutations without the need to modify the mutation string directly.
{% endhint %}



