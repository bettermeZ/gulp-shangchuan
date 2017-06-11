var Mock=require("mockjs")
module.exports=[
	{
		route:'/api/index',
		handle:function(req,res,next,url){
				//mock数据
				/*var datas = Mock.mock({
			    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
				    'list|1-10': [{
				        // 属性 id 是一个自增数，起始值为 1，每次增 1
			        'id|+1': 1
				    }]
				})
				// 输出结果
				console.log(JSON.stringify(datas, null, 4))*/

				//邮箱
				// var datas=Mock.mock({email:'@email'})
				//mock扩展
				var Random=Mock.Random
				Random.extend({
					constelltion:function(date){
						var constelltions=['白羊座','金牛座','射手座','狮子座','摩羯座','双子座','处女座','天秤座']
						return this.pick(constelltions)
					}
				})
				var datas=Random.constelltion()
				var datas=Random.boolean()
		      	res.writeHead(200,{
		      		"Content-type":"application/json;charset=UTF-8",
		      		"Access-Control-Allow-Origin":"*"
		      	});
		      	res.write(JSON.stringify(datas));
		      	res.end()
				}
	},
	{
		route:'/api/tab',
		handle:function(req,res,next,url){
				/*var datas=[
					{
						name:"zhangsan"
					},
					{
						name:"lisi"
					},
					{
						name:"wangwu"
					}
				]*/
			var Random=Mock.Random;
			Random.integer();
			Random.string('lower',4)
			Random.date('yyyy-MM-dd')
			var datas=Mock.mock({
				"menuList|6":[{
					"menuNav":"@string()",
					"meauNavContent|1-5":[{
						"url":"index.html",
						"name":"@string('lower',4)",
						"id":"@integer(0,10)"
					}]
				}]
			})	
	      	res.writeHead(200,{
	      		"Content-type":"application/json;charset=UTF-8",
	      		"Access-Control-Allow-Origin":"*"
	      	});
	      	res.write(JSON.stringify(datas));
	      	res.end()
			}
	}
]