angular-fetcher
===============

A versatile directive for fetching items. Useful for typeahead/autocomplete functionality.

### To Use
- `bower install --save twhitbeck/angular-fetcher`
- Reference angular-fetcher.js
    - `<script src="bower_components/angular-fetcher/angular-fetcher.js"></script>`
- Add `tw.directives.fetcher` as a dependency in your angular module
    - `var app = angular.module('myApp', ['tw.directives.fetcher']);`
- Add `tw-fetcher` attribute to your input and point it to a function which takes one paramater, `$query` and returns either your data or a promise which will resolve to your data.

### Recipes
#### Local data
```html
<input type="text" ng-model="colorQuery" tw-fetcher="fetchMatchingColors($query)" model="matchingColors">

<h3>Results for '{{colorQuery}}'</h3>
<ul>
  <li ng-repeat="color in matchingColors" ng-bind="color"></li>
</ul>
```

```js
var colors = ['red', 'green', 'blue', 'lightblue', 'dinosaurgreen'];

$scope.fetchMatchingColors = function(query) {
  return $filter('filter')(colors, function(color) {
    return ~color.indexOf(query);
  });
};
```

#### Prefetched remote data
```js
var peoplePromise = $http.get('api/people').then(function(response) {
  return response.data;
});

$scope.fetchMatchingPeople = function(query) {
  return peoplePromise.then(function(people) {
    return $filter('filter')(people, query);
  });
};
```

#### Debounced, cached remote lookup
```js
// Simple in-memory cache, could be changed to localStorage or something else more persistent
var cache = {}, timeout;

$scope.fetchMatchingPeople = function(query) {
  $timeout.cancel(timeout);

  if (!query) {
    return [];
  }

  if (cache[query]) {
    return cache[query];
  }

  return timeout = $timeout(function() {
    return cache[query] = $http.get('api/people', {
      params: {
        query: query
      }
    }).then(function(response) {
      return response.data;
    });
  }, 300);
};
```

### To Tinker
- `npm install`
- `bower install`
- `gulp`
- Point your browser to `http://localhost:3000/test/`
