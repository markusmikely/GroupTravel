ApiService.$inject = ['$http'];
function ApiService($http) {

    return {
        Get: function(url) {
          return $http.get(url);
        },
        Post: function(url, data) {
          var package = {};
        //   var package = {
        //     "_links":{
        //       "type":{
        //         "href": "http://localhost/grouptravel/app/backend/web/rest/type/node/attraction"
        //       }
        //     },
        //     "type":[
        //         {
        //           "target_id": "attraction"
        //         }
        //     ],
        //     "title":[{
        //       "value": "attraction testting",
        //       "lang": "en"
        //     }],
        //     "body" :[{
        //       value: '<p>Originally a road to connect Portobello Farm with Kensal Green to Notting Hill, residential areas had been developed from after midway into the 19th century. The wealthy inhabited the area which led to a thriving local economy with its stores and markets able to earn more and the local working class able to find employment as construction workers, messengers, coachmen, tradesmen, domestic servants and costermongers.</p><p>Today, Portobello Road is home to a variety of markets to appeal towards different people with different interests. All of the markets open on Saturdays which is the perfect day if you want to get the full experience. Antiques, bric-a-brac, fruit, vegetables, fashion, new goods and pre-owned goods can all be found in Portobello Road Market. The largest market is the antiques market where over a thousand dealers go to sell their collector’s items and antiques; these include items like glass and books across different eras.</p><p>You can enjoy the Victorian structures of the buildings that squeeze up the space in the area as well as the meandering and curving road. One of the oldest cinemas, the Electric Cinema, is located in Portobello Market as a Grade II building.</p>",
        //       format: "basic_html",
        //       summary: "One of the most popular and beloved marketplaces in the UK, it is visited by tourists every day with attractive Victorian structures and home to various grade II buildings."
        //     }
        //   ],
        //   field_address: [{
        //     country_code: "GB",
        //     locality: "London",
        //     postal_code: "SW16 1AN",
        //     address_line1: "14 beckett close",
        //     address_line2: "Beckett Close",
        //   }],
        //   field_experience_tags: [{
        //     target_id: 2,
        //     target_type: "taxonomy_term",
        //     target_uuid: "8db7eba4-a95f-48e5-81e4-f8683b8425c8",
        //     url: "/grouptravel/app/backend/web/taxonomy/term/2"
        //     },
        //     {
        //     target_id: 1,
        //     target_type: "taxonomy_term",
        //     target_uuid: "6130aeb7-6890-4d83-9330-3447f5b8b601",
        //     url: "/grouptravel/app/backend/web/taxonomy/term/1"
        //     },
        //     {
        //     target_id: 11,
        //     target_type: "taxonomy_term",
        //     target_uuid: "891f1505-11ea-4076-b2a7-e75fced29a75",
        //     url: "/grouptravel/app/backend/web/taxonomy/term/11"
        //     },
        //     {
        //     target_id: 12,
        //     target_type: "taxonomy_term",
        //     target_uuid: "1320a1fb-60e8-4dda-bbd5-b22de299c7d9",
        //     url: "/grouptravel/app/backend/web/taxonomy/term/12"
        //     },
        //     {
        //     target_id: 13,
        //     target_type: "taxonomy_term",
        //     target_uuid: "2e29caa0-582e-4189-8c4d-0a935bef7fea",
        //     url: "/grouptravel/app/backend/web/taxonomy/term/13"
        //     },
        //     {
        //     target_id: 4,
        //     target_type: "taxonomy_term",
        //     target_uuid: "bd5b8d33-60c8-4563-9ac2-9654cfa3a757",
        //     url: "/grouptravel/app/backend/web/taxonomy/term/4"
        //   }],
        //   field_featured: [{
        //     value: true
        //   }],
        //     field_images: [{
        //     target_id: 7,
        //     alt: "",
        //     title: "",
        //     width: 615,
        //     height: 407,
        //     target_type: "file",
        //     target_uuid: "edc9c78b-2dee-4e5d-9344-3a63f15f1fe7",
        //     url: "http://localhost/grouptravel/app/backend/web/sites/default/files/2017-06/Alton-Towers-2_0.jpg"
        //   },
        //   {
        //     target_id: 8,
        //     alt: "",
        //     title: "",
        //     width: 615,
        //     height: 407,
        //     target_type: "file",
        //     target_uuid: "11c3da08-e6f3-4476-aaa1-bea7dcc44d94",
        //     url: "http://localhost/grouptravel/app/backend/web/sites/default/files/2017-06/Alton-Towers-rollercoaster-crash-582854_0.jpg"
        //   },
        //   {
        //     target_id: 9,
        //     alt: "",
        //     title: "",
        //     width: 615,
        //     height: 407,
        //     target_type: "file",
        //     target_uuid: "c2f6337c-bf54-4715-a81c-c4489392eaaf",
        //     url: "http://localhost/grouptravel/app/backend/web/sites/default/files/2017-06/altontowersdlp_1_0.png"
        //   },
        //   {
        //     target_id: 10,
        //     alt: "",
        //     title: "",
        //     width: 615,
        //     height: 407,
        //     target_type: "file",
        //     target_uuid: "ec2a07f6-87f7-45de-955a-46359404d868",
        //     url: "http://localhost/grouptravel/app/backend/web/sites/default/files/2017-06/images%20%281%29_0.jpeg"
        //   },
        //   {
        //     target_id: 11,
        //     alt: "",
        //     title: "",
        //     width: 615,
        //     height: 407,
        //     target_type: "file",
        //     target_uuid: "5e74531c-9519-495b-a951-b253afb5f420",
        //     url: "http://localhost/grouptravel/app/backend/web/sites/default/files/2017-06/images_0.jpeg"
        //   }],
        //   field_k: [
        //     {
        //       value:data.feature1,
        //       format: "basic_html"
        //     },
        //     {
        //       value: data.feature2,
        //       format: "basic_html"
        //     },
        //     {
        //       value: data.feature3,
        //       format: "basic_html"
        //     },
        //     {
        //       value: data.feature4,
        //       format: "basic_html"
        //     }
        //   ],
        //   field_location: [{
        //     value: "POINT (-0.119252 51.509097)",
        //     geo_type: "Point",
        //     lat: 51.509097,
        //     lon: -0.119252,
        //     left: -0.119252,
        //     top: 51.509097,
        //     right: -0.119252,
        //     bottom: 51.509097,
        //     geohash: "gcpvj2cnjpxk",
        //     latlon: "51.509097,-0.119252"
        //   }],
        //   field_rank: [
        //     {
        //       popularity: data.popularity,
        //       upsell: data.upsell,
        //     }
        //   ],
        //   field_time_required: [{
        //     value: 0.25
        //   }]
        // };
          var url = "http://localhost/grouptravel/app/backend/web/entity/node?format=hal_json";

          return $http.get('http://localhost/grouptravel/app/backend/web/rest/session/token').then(function(response) {
            if(response.status == 200) {
              var csrf = response.data;

                return $http({
                  url: url,
                  method : 'POST',
                  data: package,
                  headers : {
                    'X-CSRF-TOKEN': csrf,
                    'Content-Type': 'application/hal+json',
                    'Accept': 'application/hal+json',
                    'Authorization': 'Basic YWRtaW46bW5ram9pMDk='
                  },
                });
            }
          });
        },
        Patch: function(package, id) {

          var url = 'http://localhost/grouptravel/app/backend/web/node/'+id+'?format=hal_json';

          return $http.get('http://localhost/grouptravel/app/backend/web/rest/session/token').then(function(response) {
            if(response.status == 200) {
              var csrf = response.data;

              return $http({
                url: url,
                method : 'PATCH',
                data: package,
                headers : {
                  'X-CSRF-TOKEN': csrf, //'YijdLPLAI46wQxwCgAyd5bGwfV9Aq9C2mz8t8aX3mNA'
                  'Content-Type': 'application/hal+json',
                  'Accept': 'application/hal+json',
                  'Authorization': 'Basic YWRtaW46bW5ram9pMDk='
                },
              });
            }
          });
        }
    };
};
