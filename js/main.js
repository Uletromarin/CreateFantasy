;
(function(){
	Vue.component('modal', {
		template: '.section_inform_img'
	})
	var app = new Vue({
		el: '.main', 
		data: {
			selected: -1,

			email: null,
			fullName: null,
			userName: null,
			password: null,
			phone: null,

			showModalInform: false,

			access_token: null,

			pictureItem: [],

			currentPicture: {},

			loading: false
		},
		methods: {
			openImg(event)
			{
				app.showModalInform = true
				app.currentPicture = app.pictureItem[event.target.dataset.id]
			},

			change(event)
			{
				app.selected = event.target.dataset.button
			},
			preventClose(prevent) {prevent.stopPropagation()},

			signUp(event)
			{
				event.preventDefault();
				app.loading = true

				axios({
					url:event.target.action ,
 					method: event.target.method,
 					headers: {"Content-Type": "application/json"},
 					data:{
					  email: app.email,
					  phone: app.phone,
					  fullName: app.fullName,
					  password: app.password,
					  username: app.userName,
					  roles: [
					    "user"
					  ]
					}})
					
					.then(function(response, text, request){
  						alert("Регистрация прошла успешно!")
 				 	})
					.catch(function (){})
					.then(function() {
						app.loading = false
					});
			},

			signIn(event)
			{
				event.preventDefault();
				app.loading = true
				axios({
					url: event.target.action,
					method: event.target.method,
					headers: {"Content-Type": "application/json"},
					data:{
						"name": app.userName,
  						"allowedGrantTypes": [
   						 "password", "refresh_token"]
				}})
				.then(function(response, text, request){
					var client= response.data;
					axios({
						url: "http://gallery.dev.webant.ru/oauth/v2/token",
    						method: event.target.method,
    						headers:{"Content-Type": "application/x-www-form-urlencoded"},
    						data: new URLSearchParams({
                                client_id: client.id + '_' + client.randomId,
                                grant_type: "password",
                                password: app.password,
                                username: app.userName,
                                client_secret: client.secret
                            })
				})
					.then(function(response){
    							localStorage.setItem("access_token", response.access_token);
    							app.access_token = response.access_token;
    							app.selected = 0
    							app.loading = false
    						})
					.catch(function(){})
				})
					.catch(function(){})
					.then(function() {
						app.loading = false
					});
				},
				
			exit()
			{
				localStorage.setItem("access_token", null)
				app.access_token = localStorage.getItem("access_token") 
			}
		},

		watch: {
			 selected: function(){
				this.loading = true
				axios({
					url: "http://gallery.dev.webant.ru/api/photos",
					headers:{"Content-Type": "application/json"},
 					params:{
   							"new": app.selected == 0,
    						"popular": app.selected == 1
  						}
				})

				.then(function(response){
					app.loading = false
					app.pictureItem = response.data.data
				})
				.catch(function(){})
				.then(function(){
					app.loading = false
				})
			}
		},
		
	mounted: function(){
	this.access_token = localStorage.getItem("access_token");
	this.selected = 0
	}

	})

}())


