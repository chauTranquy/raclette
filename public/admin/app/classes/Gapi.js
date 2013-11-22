Ext.define('TextoCMS.classes.Gapi',{
	singleton:true,
	token:null,
	scopes :'https://www.googleapis.com/auth/analytics.readonly',
	connect:function(cb, immediate){
		
		gapi.client.setApiKey(this.googleClientSecret);
	  	  window.setTimeout(this.checkAuth.bind(this, cb, immediate), 1);
		
	},
	 checkAuth:function(cb, immediate) {
	   
		 if(immediate ==undefined) immediate=true;
		
      	  gapi.auth.authorize({
   	    client_id: this.googleClientID, scope: this.scopes, immediate: immediate}, this.handleAuthResult.bind(this, cb));
   	},
   	
   	 handleAuthResult:function(cb, authResult) {
   		   		 /*
   		   		  * 		$result = array('googleClientID'=>$site->__get('googleClientID'),
				"googleClientSecret"=>$site->__get('googleClientSecret'),
		"googleProfileId"=>$site->__get('googleProfileId'),
		"googleAccountId"=>$site->__get('googleAccountId'),
		"googleWebPropertyId"=>$site->__get('googleWebPropertyId'),
		"googleActivated"=>$site->__get('googleActivated'));
   		   		  */
   	     if(cb==undefined)cb=Ext.emptyFn;
   		  if (authResult) {
   		    gapi.client.load('analytics', 'v3', cb);
   		    this.token = gapi.auth.getToken(); 
   		  } else {
   			 this.token=null;
   			Ext.Msg.alert('Erreur', 'Vous devez &ecirc;tre connect&eacute; &agrave; Google!');
   			 
   			if(authResult==null)this.checkAuth(cb, false);
   			 
   			 //this.connect(cb);
   		    //handleUnauthorized();
   		  }
   		},
   		getAccountProperties:function(cb){
   			
   			if(cb==undefined)cb = Ext.emptyFn;
   			if(!this.token){
   				
   				return this.connect(this.getAccountProperties.bind(this, cb));
   			}
   			gapi.client.analytics.management.profiles.list({ "accountId": this.googleAccountId,
   				"webPropertyId": this.googleWebPropertyId}).execute(this.checkResult.bind(this, cb));
   			
   		},
   		
   		checkResult:function(cb, result){
   			
   			
   			if(result.error) {
   				   				
   				if(parseInt(result.error.code)==401) this.connect(cb, false);
   				
   				else if(parseInt(result.error.code)== 403) Ext.Msg.alert('Erreur !', 'Vous n\'avez pas les autorisations requises pour visualiser les statistiques Google Analytics.<br />Veuillez contacter l\'administrateur du site'+' [code '+result.error.code+']');
   				else Ext.Msg.alert('Erreur Gapi', result.error.message+' [code '+result.error.code+']');
   				this.token=null;
   			}
   			return cb(result);
   			
   		},
   		
   		query:function(params, cb){
   			
   			if(cb==undefined)cb = Ext.emptyFn;
   			if(!this.token) return this.connect(this.query.bind(this, cb,false));
   			
   			if(!params.ids)params.ids ='ga:' + this.googleProfileId; 

   			/*
   			 * {
   			    'ids': ,
   			   'start-date': '2012-08-03',
   			    'end-date': Ext.Date.format(new Date(),'Y-m-d'),
   			   
   			 'metrics': 'ga:visits',
   		    'dimensions': 'ga:source,ga:keyword',
   		    'sort': '-ga:visits,ga:source'
   		    	//,   		    'filters': 'ga:medium==organic'

   			  }
   			 */
   			
   			gapi.client.analytics.data.ga.get(params).execute(this.checkResult.bind(this, cb));

   			
   		},
   		setParams:function(params){
   			
   			Ext.Object.each(params, function(key, value){
   				this[key]=value;
   				
   			},this);
   			
   		}
	
});