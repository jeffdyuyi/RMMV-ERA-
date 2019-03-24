//=============================================================================
// 角色状态窗口01.js
//=============================================================================

/*:
 * @plugindesc 开启角色状态窗口，显示相应属性.
 * @author 游鱼戏虾
 *
 * @param Actorname
 * @desc 角色编号
 * @default 7 
 * @param Text1
 * @desc 变量文字
 * @default 调教次数
 * @param Variable20
 * @desc 变量编号
 * @default 20
 *
 * @param Text2
 * @desc 变量文字
 * @default 顺从
 * @param Variable21
 * @desc 变量编号
 * @default 21
 *
 * @param Text3
 * @desc 变量文字
 * @default 欲望
 * @param Variable22
 * @desc 变量编号
 * @default 22
 *
 * @param Text4
 * @desc 变量文字
 * @default 侍奉精神
 * @param Variable23
 * @desc 变量编号
 * @default 23 
 *
 * @param Text5
 * @desc 变量文字
 * @default 露出癖
 * @param Variable24
 * @desc 变量编号
 * @default 24 
 *
 * @param Text6
 * @desc 变量文字
 * @default 被虐狂
 * @param Variable25
 * @desc 变量编号
 * @default 25
 *
 * @param Text7
 * @desc 变量文字
 * @default 百合心
 * @param Variable26
 * @desc 变量编号
 * @default 26
 *
 * @param Text8
 * @desc 变量文字
 * @default 异常经验
 * @param Variable27
 * @desc 变量编号
 * @default 27
 *
 * @param Text9
 * @desc 变量文字
 * @default 痛苦快乐经验
 * @param Variable28
 * @desc 变量编号
 * @default 28
 *  
 * @param Text10
 * @desc 变量文字
 * @default 自慰经验
 * @param Variable29
 * @desc 变量编号
 * @default 29
 *   
 * @param Text11
 * @desc 变量文字
 * @default 精液经验
 * @param Variable30
 * @desc 变量编号
 * @default 30
 * 
 * @param Text12
 * @desc 变量文字
 * @default 绝顶经验
 * @param Variable31
 * @desc 变量编号
 * @default 31
 *   
 * @param Text13
 * @desc 变量文字
 * @default 紧缚经验
 * @param Variable32
 * @desc 变量编号
 * @default 32
 *    
 * @param Text14
 * @desc 变量文字
 * @default 扩张经验
 * @param Variable33
 * @desc 变量编号
 * @default 33
 * 
 * @param Text15
 * @desc 变量文字
 * @default 喷乳经验
 * @param Variable34
 * @desc 变量编号
 * @default 34
 *      
 * @help 【1】开启角色n状态窗口，显示相应属性.
 *       【2】
 *  
 */
//=========================================================

var parameters = PluginManager.parameters('JF ERA actorstateX');
var actorname = Number(parameters['Actorname'] || 7);

var text1 = String(parameters['Text1']||"调教次数"); 
var tjcs = Number(parameters['Variable20'] || 20);
var text2 = String(parameters['Text2']||"顺从"); 
var sc = Number(parameters['Variable21'] || 21);
var text3 = String(parameters['Text3']||"欲望"); 
var yw = Number(parameters['Variable22'] || 22);
var text4 = String(parameters['Text4']||"侍奉精神"); 
var sfjs = Number(parameters['Variable23'] || 23);
var text5 = String(parameters['Text5']||"露出癖"); 
var lcp = Number(parameters['Variable24'] || 24);
var text6 = String(parameters['Text6']||"被虐狂"); 
var bnk = Number(parameters['Variable25'] || 25);
var text7 = String(parameters['Text7']||"百合心"); 
var bhx = Number(parameters['Variable26'] || 26);
var text8 = String(parameters['Text8']||"异常经验"); 
var ycjy = Number(parameters['Variable27'] || 27);

var text9 = String(parameters['Text9']||"痛苦快乐经验"); 
var tkkl = Number(parameters['Variable28'] || 28);
var text10 = String(parameters['Text10']||"自慰经验"); 
var zw = Number(parameters['Variable29'] || 29);
var text11 = String(parameters['Text11']||"精液经验"); 
var jy = Number(parameters['Variable30'] || 30);
var text12 = String(parameters['Text12']||"绝顶经验"); 
var jd = Number(parameters['Variable31'] || 31);
var text13 = String(parameters['Text13']||"紧缚经验"); 
var jf = Number(parameters['Variable32'] || 32);
var text14 = String(parameters['Text14']||"扩张经验"); 
var kz = Number(parameters['Variable33'] || 33);
var text15 = String(parameters['Text15']||"喷乳经验"); 
var pr = Number(parameters['Variable34'] || 34);

function Window_ActorfstStatus() {
    this.initialize.apply(this, arguments);
};

Window_ActorfstStatus.prototype = Object.create(Window_Selectable.prototype);
Window_ActorfstStatus.prototype.constructor = Window_ActorfstStatus;

Window_ActorfstStatus.prototype.initialize = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    this._actor = null;
    this.refresh();
    this.activate();
};

Window_ActorfstStatus.prototype.setActor = function(actor) {
    var actorfst = $gameActors.actor(actorname);
	if (this._actor !== actorfst) {
        this._actor = actorfst;
        this.refresh();
    }
};

Window_ActorfstStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        var lineHeight = this.lineHeight();
        this.drawBlock1(lineHeight * 0);
        this.drawHorzLine(lineHeight * 3);
        this.drawBlock2(lineHeight * 4);
        this.drawHorzLine(lineHeight * 8);
        this.drawBlock3(lineHeight * 9);
    }
};

Window_ActorfstStatus.prototype.drawBlock1 = function(y) {
	var lineHeight = this.lineHeight();
	this.drawProfile(6, y);
};

Window_ActorfstStatus.prototype.drawBlock2 = function(y) {
	var lineHeight = this.lineHeight();
    this.drawActorFace(this._actor, 12, y);
	this.drawActorName(this._actor, 72, y);
	this.drawActorEQ(this._actor, 166, y);
};


Window_ActorfstStatus.prototype.drawActorEQ = function(x, y) {
    var equips = this._actor.equips();	
	var x1 = 166;
	var x2 = 376;
	var x3 = 586;
	var y1 = y - this.lineHeight();
	var y2 = y1 + this.lineHeight();
	var y3 = y2 + this.lineHeight();
//	性格	
    this.drawItemName(equips[2], x1, y1);
	this.drawItemName(equips[3], x1, y2);
	this.drawItemName(equips[4], x1, y3);
//	体质	
	this.drawItemName(equips[5], x2, y1);
	this.drawItemName(equips[6], x2, y2);
	this.drawItemName(equips[7], x2, y3);
//	天赋	
	this.drawItemName(equips[8], x3, y1);
	this.drawItemName(equips[9], x3, y2);
	this.drawItemName(equips[10], x3, y3);
};


Window_ActorfstStatus.prototype.drawBlock3 = function(y) {
    this.drawParameters(6, y);
	this.drawParameters2(256, y)
	this.drawParameters3(506, y)
};

Window_ActorfstStatus.prototype.drawHorzLine = function(y) {
    var lineY = y + this.lineHeight() / 2 - 1;
   this.contents.paintOpacity = 48;
    this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.lineColor());
    this.contents.paintOpacity = 255;
};

Window_ActorfstStatus.prototype.lineColor = function() {
    return this.normalColor();
};

Window_ActorfstStatus.prototype.drawParameters = function(x, y) {
    var lineHeight = this.lineHeight();
    for (var i = 0; i < 6; i++) {
        var paramId = i + 2;
        var y2 = y + lineHeight * i;
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.param(paramId), x, y2, 160);
        this.resetTextColor();
        this.drawText(this._actor.param(paramId), x + 160, y2, 60, 'right');
		this.changeTextColor(this.systemColor());
		this.drawText(text1, x, y + lineHeight * 6, 160);
//		this.drawText("调教次数", x, y + lineHeight * 6, 160);
		this.resetTextColor();
		this.drawText($gameVariables.value(tjcs), x + 160, y + lineHeight * 6, 60, 'right');
    }
};

Window_ActorfstStatus.prototype.drawParameters2 = function(x, y) {
	var lineHeight = this.lineHeight();
    this.changeTextColor(this.systemColor());
	this.drawText(text2, x, y + lineHeight * 0,160);
	this.drawText(text3, x, y + lineHeight * 1,160);
	this.drawText(text4, x, y + lineHeight * 2,160);
	this.drawText(text5, x, y + lineHeight * 3,160);
	this.drawText(text6, x, y + lineHeight * 4,160);
	this.drawText(text7, x, y + lineHeight * 5,160);
	this.drawText(text8, x, y + lineHeight * 6,160);
    this.resetTextColor();
	this.drawText($gameVariables.value(sc), x + 160, y + lineHeight * 0, 60, 'right');
	this.drawText($gameVariables.value(yw), x + 160, y + lineHeight * 1, 60, 'right');
	this.drawText($gameVariables.value(sfjs), x + 160, y + lineHeight * 2, 60, 'right');
	this.drawText($gameVariables.value(lcp), x + 160, y + lineHeight * 3, 60, 'right');
	this.drawText($gameVariables.value(bnk), x + 160, y + lineHeight * 4, 60, 'right');
	this.drawText($gameVariables.value(bhx), x + 160, y + lineHeight * 5, 60, 'right');
	this.drawText($gameVariables.value(ycjy), x + 160, y + lineHeight * 6, 60, 'right');
};

Window_ActorfstStatus.prototype.drawParameters3 = function(x, y) {
	var lineHeight = this.lineHeight();
    this.changeTextColor(this.systemColor());
	this.drawText(text9, x, y + lineHeight * 0,160);
	this.drawText(text10, x, y + lineHeight * 1,160);
	this.drawText(text11, x, y + lineHeight * 2,160);
	this.drawText(text12, x, y + lineHeight * 3,160);
	this.drawText(text13, x, y + lineHeight * 4,160);
	this.drawText(text14, x, y + lineHeight * 5,160);
	this.drawText(text15, x, y + lineHeight * 6,160);
    this.resetTextColor();
	this.drawText($gameVariables.value(tkkl), x + 160, y + lineHeight * 0, 60, 'right');
	this.drawText($gameVariables.value(zw), x + 160, y + lineHeight * 1, 60, 'right');
	this.drawText($gameVariables.value(jy), x + 160, y + lineHeight * 2, 60, 'right');
	this.drawText($gameVariables.value(jd), x + 160, y + lineHeight * 3, 60, 'right');
	this.drawText($gameVariables.value(jf), x + 160, y + lineHeight * 4, 60, 'right');
	this.drawText($gameVariables.value(kz), x + 160, y + lineHeight * 5, 60, 'right');
	this.drawText($gameVariables.value(pr), x + 160, y + lineHeight * 6, 60, 'right');
};

Window_ActorfstStatus.prototype.drawProfile = function(x, y) {
    this.drawTextEx(this._actor.profile(), x, y);
};
//==================================================================
function Scene_Actorfst() {
    this.initialize.apply(this, arguments);
};

Scene_Actorfst.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Actorfst.prototype.constructor = Scene_Actorfst;

Scene_Actorfst.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};
	
Scene_Actorfst.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._statusWindow = new Window_ActorfstStatus();
    this._statusWindow.setHandler('cancel',   this.popScene.bind(this));
    this._statusWindow.reserveFaceImages();
    this.addWindow(this._statusWindow);
};

Scene_Actorfst.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this.refreshActor();
};

Scene_Actorfst.prototype.refreshActor = function() {
    var actorfst = $gameActors.actor(7);
    this._statusWindow.setActor($gameActors.actor(7));
};

Scene_Actorfst.prototype.onActorChange = function() {
    this.refreshActor();
    this._statusWindow.activate();
};