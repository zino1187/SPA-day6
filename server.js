/*웹서버 구축하기*/
var http=require("http");//기본 서버 모듈
var express=require("express"); //기본 서버 모듈의 보완모듈
var mysql=require("mysql"); //mysql 데이터베이스 핸들링 해주는 모듈
//npm = nodejs   package  manager 모듈 다운로드 받을때 사용하는
//명령어..  npm  install 대상모듈,  <-->  npm  uninstall  대상모듈

//클라이언트가 전송한 파라미터값들을 json 형식으로 자동으로
//변화해서 전달해줌...
var bodyParser=require("body-parser");

var app=express();
var server=http.createServer(app);

//html, 이미지, 음원소스, 동영상 과 같은 자원들을 가리켜 정적자원
//이라고 하며, express 모듈을 이용하면 이러한 정적자원의 위치를
//개발자가 지정할 수 있게 해주어서, 클라이언트의 브라우저는 이 파일
//들의 경로를 포함한 명칭을 적으면 다운로드 받을수 있게 된다..
//express 모듈은 여러가지 기능을 갖는 미들웨어를 
// 지원하는데 , 이 미들웨어를사용할때는 use() 메서드를
//이용한다...
app.use(express.static(__dirname)); 

//{{}} json 객체간 중첩허용
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); //json 형식으로 파라미터를 변환

//회원 등록 요청 처리 ....
app.post("/member/regist", function(request, response){
	console.log("클라이언트의 post 전송을 받았습니다!!");
	console.log(request.body); //{} json
	var id=request.body.id;
	var pw=request.body.pw;
	var name=request.body.name;

	//mysql 에 insert 하기!!
	var con=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:"front2"
	});
	
	con.connect(function(error){
		if(error){
			console.log("접속실패");
		}else{
			console.log("접속 성공");
			//등록 쿼리문 수행!!!
			var sql="insert  into member2(id, pw, name) values(?,?,?)";

			//DML(insert,update,delete)은 익명함수의 인수가 2개이다...
			con.query(sql, [id,pw,name], function(err, result){
				if(err){
					console.log( err ,"등록실패");
				}else{
					response.writeHead(200, {"Content-Type":"text/html"});
					response.end("ok");
				}
				con.end(); //사용한 접속객체 닫기!!
			});
		}
	});//접속!!!!

});

//리스트 요청 처리 
app.get("/member/list", function(request, response){
	var con=mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"",
		database:"front2"
	});
	
	con.connect(function(error){
		if(error){
			console.log(error);
		}else{//접속이 성공했다면...
			var sql="select * from member2 order by member2_id asc";

			//select문의 익명함수는 인수가 3개이다!!
			//result : 레코드가 json 형태로 배열로 담어져 있음..
			// fields : 메타정보가 들어있음...
			con.query(sql, function(err, result, fields){
				if(err){
					console.log(err);
				}else{
					console.log(result);
					//서버에서만 뿌리지말고, 클라이언트인 브라우저에게
					//json 배열을 보내보자!!
					response.writeHead(200,{"Content-Type":"text/html"});

					//json 자체는 객체이며, 전송대상이 될 수 없다!!!
					//따라서 json 표기법을 문자열화 시켜야 전송이 가능하다!!
					response.end(JSON.stringify(result));
				}
			});//쿼리문 수행	
		}
	});

});

server.listen(9999, function(){
	console.log("웹서버가 9999포트에서 실행중...");
});

