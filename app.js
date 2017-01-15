// ====================================================================================================================================================
// Hotpick Prototype using FramerJS 
// ====================================================================================================================================================
// 2014.02.12 - sollmo
// ====================================================================================================================================================
// 전반적으로 트랜지션이나 애니메이션 자체에 포커스가 맞춰진 툴이라는 느낌.
// 앱의 전체적인 플로우를 설계하는데는 부적합해보이나(힘이 너무 많이 들어갈 것 같다!), 
// GUI가 어느정도 나온 상태에서 Google Now, News Feed 등의 예제처럼 특정한 애니메이션을 미리 프로토타이핑해보는데에는 굉장히 좋을 것 같다. 
// 일단 재밌다!
//
// PSD를 저장한 상태로 Framer를 돌리면 Photoshop(플러그인을 통해 Sketch도 사용가능)의 PSD의 레이어그룹을 View라는 오브젝트로 자동 변환시킨다.
// View는 Framer의 기본 오브젝트로 x, y, width, height, scale, opacity 등의 기본 properties를 가지고 있고, 텍스트나 이미지를 품을 수 있다.
// 또 View들은 서로 하아어라키가 있어, subview(자식), superview(부모)를 이용해 종속관계를 만들어 컨트롤할 수 있다.
//
// 자동으로 변환된 View들은 Photoshop 레이어 그룹 이름을 그대로 가지는데, 이 이름을 통해 js 파일 안에서 오브젝트(=레이어그룹=View)를 호출 가능하다.
// Photoshop에서 NavBar라는 이름의 레이어 그룹을 만든 후, 자동생성되는 app.js에서 PSD["NavBar"] 혹은 PSD.NavBar로 바로 불러올 수 있다.
// 그리고 불려진 View들은 View.on(<event>, <function>), View.animate({..})를 통해 기본적인 속성에 이벤트 및 애니메이션을 줄 수 있다.
//
// 또한 작업 도중 PSD 파일을 지속적으로 수정해도 Framer 자체를 계속 re-run 시켜주면 app.js의 코드는 안전하게 유지된 채로 그래픽 어셋만 업데이트된다.
//
// + Index.html이 부를 수 있는 오브젝트 알아볼 때, Developer Console에서 PSD, PSD.Screen.height 등의 오브젝트를 불러보면 결과가 바로 나와 편하다. 난 이런걸 모르지. 근본이 없으니.
// + PSD의 그룹 레이어 구조(+마스크, 네이밍)등이 FramerJS 초기화랑 밀접한 연관이 있다. 대부분의 디버깅이 포토샵 레이어 구조 수정이었다.
// + 위 부분은 FramerJS의 The rules for converting Photoshop files 참고.
// + Shift(누르고 있으면 애니메이션 딜레이가 25배 증가, 애니메이션 관찰용), Escape(토글로 디버그뷰로 전환, 스트럭쳐와 포지션 검사용)의 디버깅 숏컷 기능 제공
// ====================================================================================================================================================




// ----------------------------------------------------------------- Hide the button touch rects and set up all obejects that need to align.

PSD.ButtonSlideMenu.opacity = 0;
PSD.ButtonCart.opacity = 0;
PSD.ButtonBackToFeed.opacity = 0;
PSD.TabAll.opacity = 0;
PSD.TabFollowing.opacity = 0;
PSD.TabTextAll.opacity = 1;
PSD.TabTextFollowing.opacity = 1;
PSD.ButtonBack.opacity = 0;
PSD.NavBarInclBack.visible = false;

PSD.SlideMenu.superView = PSD.Screen;
PSD.SlideMenu.x = 0;
PSD.SlideMenu.y = PSD.Status.maxY;

PSD.NewsFeed.superView = PSD.Screen;
PSD.NewsFeed.x = 0;
PSD.NewsFeed.y = PSD.Status.maxY;
// Screen.height을 계속 50으로 불러오는 문제가 있었음. 예제와 레이어구조를 같게 했으나 계속 실패.
// ScreenBack이라는 그룹을 만들어 Mask용 Rectangle을 집어넣으니 1280으로 불러온다. 그전에는 Rectangle의 height을 읽지 못한거같은데..왜죠? 레이어는 무조껀 그룹 레이어로 묶어야한다는 건가..
PSD.FeedScroll.height = PSD.Screen.height - PSD.NewsFeed.y;
PSD.FeedScroll.scrollHorizontal = false;

PSD.Cart.superView = PSD.Screen;
PSD.Cart.x = 720;
PSD.Cart.y = PSD.Status.maxY;

var animationCurve = "spring(600,37,400)";
var animationCurve2 = "spring(400,37,400)";
var animationPager = "spring(700,80,1000)";
var animationDealDesc = "spring(300,37,100)";
var animationDealDescArrow = "spring(280,37,100)";

var DealDescStatus = false;

// ----------------------------------------------------------------- Set up the slide menu animations
showSildeMenu = function() {
	PSD.NewsFeed.animate({
		properties: {x:630},
		curve: animationCurve
	})
};

hideSildeMenu = function() {
	PSD.NewsFeed.animate({
		properties: {x:0},
		curve: animationCurve
	})	
};

// 토글만들어주는 유틸함수인듯.. console에다가 util 치면 주르륵나옴. 근데 왜 친절한 도큐먼트 안만들어놨지?!
slideMenuToggle = utils.toggle(showSildeMenu, hideSildeMenu);

PSD.ButtonSlideMenu.on("click", function(){
    //utils.toggle로 집어넣은 갯수만큼 ()를 해줘야하나봐. 어레이같은 느낌인가..
    slideMenuToggle()();
});


// ----------------------------------------------------------------- Set up the cart animations

showCart = function() {
	PSD.NewsFeed.animate({
		properties: {x:-720},
		curve: animationCurve2
	})
    PSD.Cart.animate({
        properties: {x:0},
        curve: animationCurve2
    })
};

hideCart = function() {
	PSD.NewsFeed.animate({
		properties: {x:0},
		curve: animationCurve2
	})
    PSD.Cart.animate({
        properties: {x:720},
        curve: animationCurve2
    })
};

PSD.ButtonCart.on("click", function(){
    showCart();
});

PSD.ButtonBackToFeed.on("click", function(){
    hideCart();
});


// ----------------------------------------------------------------- Set up the tab animations

PSD.FeedFollowing.x = -720;

moveToTabFollowing = function() {
	PSD.Feed.animate({
		properties: {x:720},
		curve: animationCurve2
	})
    PSD.FeedFollowing.animate({
        properties: {x:0},
        curve: animationCurve2
    })
    PSD.TabIndicator.animate({
        properties: {x:0},
        curve: animationCurve
    })
    PSD.TabTextAll.opacity = 1;
    PSD.TabTextFollowing.opacity = 1;
    
    PSD.FeedScroll.scrollVertical = false;
    PSD.FeedScroll.scrollHorizontal = false;
};

moveToTabFeed = function(){
    PSD.FeedFollowing.animate({
        properties: {x:-720},
        curve: animationCurve2
    })
    PSD.Feed.animate({
        properties: {x:0},
        curve: animationCurve2
    })
    PSD.TabIndicator.animate({
        properties: {x:120},
        curve: animationCurve
    })
    PSD.TabTextAll.opacity = 1;
    PSD.TabTextFollowing.opacity = 1;
    
    PSD.FeedScroll.scrollVertical = true;
};

PSD.TabFollowing.on("click", function(){
    moveToTabFollowing();
});

PSD.TabAll.on("click", function(){
    moveToTabFeed();
});


// ----------------------------------------------------------------- Set up the Deal Page & Deal Description

openDealPage = function(){
    PSD.TabBar.visible = false;
    PSD.Deal.visible = false;
    PSD.DealDescBody.y = -300;
    PSD.DealBlack.opacity = 0;
    PSD.FeedScroll.scrollVertical = false;
    PSD.DealDescArrow.y = 27;
    PSD.DealDescArrow.rotationZ = 180;
    
    PSD.DealDescBody.animate({
        properties:{y:0},
        curve: animationDealDesc
    })    
    PSD.DealBlack.animate({
        properties:{opacity:1},
        curve: animationDealDesc
    })
    PSD.DealDescArrow.animate({
        properties:{rotationZ:0, y:315},
        curve: animationDealDescArrow
    })
    
    DealDescStatus = true;
};

closeDealDesc = function(){
    PSD.DealDescBody.animate({
        properties: {y:-288},
        curve: animationDealDesc
    })
    PSD.DealBlack.animate({
        properties:{opacity:0},
        curve: animationDealDesc
    })
    PSD.DealDescArrow.animate({
        properties:{rotationZ:180, y:27},
        curve: animationDealDescArrow
    })
    
    DealDescStatus = false;
};

PSD.Deal.on("click", function(){
    PSD.NavBarInclBack.visible = true;
    openDealPage();
    setTimeout(closeDealDesc, 2500);
});


// Set up the Deal Desc Area Toggle

PSD.DealBlack.on("click", function(){
    closeDealDesc();
});

PSD.DealDescTitle.on("click", function(){
    if(DealDescStatus == false){
        openDealPage();
    }else{
        console.log("already opened");       
    }
});


// Set up the back button in DealPage NavBar

backToFeed = function() {
    PSD.TabBar.visible = true;
    PSD.Deal.visible = true;
    PSD.NavBarInclBack.visible = false;
    PSD.FeedScroll.scrollVertical = true;
};

PSD.ButtonBack.on("click", function(){
    backToFeed();
});



// ----------------------------------------------------------------- Set up the Zoom In/Out Button

zoomButton = new View({
    x:800, y: 50,
    width:200, height:34
});

zoomButton.style = {
	padding: "10px", textAlign: "center", background:"none", font: "12px Menlo, Courier New, Serif", color: "#FFFFFF", cursor:"pointer", border:"1px solid white"
};

zoomButton.html = "Zoom In / Zoom Out";

function zoomOut() {
    document.body.style.zoom = "65%" 
};

function zoomIn() {
    document.body.style.zoom = "100%" 
};

zoomToggle = utils.toggle(zoomOut, zoomIn);
zoomButton.on("click", function(){
    zoomToggle()();
});


// ----------------------------------------------------------------- Set up the hint View (html text)

hintView = new View({
	x:800, y:100,
	width:400, height:200
});

hintView.style = {
	padding: "0px",
	textAlign: "left",
    background:"none",
    font: "12px/20px Menlo, Courier New, Serif",
    color: "#ffffff"
};

hintView.html = "Clickable Objects<br>&nbsp;* Navigation Bar: Drawer, Cart<br>&nbsp;* Tab Bar: ❤, All<br>&nbsp;* Deal Card<br>&nbsp;* Detail View: Back, Deal Description Area<br><br>Hotpick Android Prototype v0.3.2<br>Last Updated: 2014.01.11";


