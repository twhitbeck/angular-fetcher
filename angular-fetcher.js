angular.module('tw.directives.fetcher', []).
directive('twFetcher', function($parse) {
  'use strict';

  return {
    require: '?ngModel',
    link: function(scope, el, attr, ctrl) {
      if (!attr.twFetcher || !attr.model) {
        return;
      }

      var fetcher = $parse(attr.twFetcher),
        modelSetter = $parse(attr.model).assign,
        mostRecent;

      var fetch = function fetch(query) {
        mostRecent = query;

        var result = fetcher(scope, {$query: query});

        if (angular.isObject(result) && result.then) {
          result.then(function resolved(data) {
            if (query === mostRecent) {
              modelSetter(scope, data);
            }
          });
        } else {
          modelSetter(scope, result);
        }

        return query;
      };

      if (ctrl) {
        ctrl.$parsers.unshift(fetch);
        ctrl.$formatters.unshift(fetch);
      } else {
        el.bind('input', function(e) {
          scope.$apply(function() {
            fetch(this.value);
          });
        });
      }
    }
  };
});
