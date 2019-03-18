//=============================================================================
// ERA调教.js
//=============================================================================

/*:
 * @plugindesc 战斗流程修改.做出类似ERA的效果
 * @author 游鱼戏虾
 * 
 * @help 【1】无法选择战斗逃走，去除攻击防御，去除战斗log
		【2】请把技能的type对应修改为调教大类，再把技能设置为调教选项
		【3】请把生命和魔法值作为体力使用，TP是主角的，嗯那个啥的度
		【4】想要在保留原版战斗的基础上调用调教，后续可能会改成newbattle，思路和调用需要请大佬指点
		【5】最重要的！！！所有的格式都是硬写的！！！甚至没有子类和父类！！！因此复用性非常的差！！！！需要大佬把核心文字改为变量
 */

BattleManager.displayStartMessages = function() {
    $gameTroop.enemyNames().forEach(function(name) {
//        $gameMessage.add(TextManager.emerge.format(name));  //不显示敌人名称
    });
//    if (this._preemptive) {
//        $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
//    } else if (this._surprise) {
//        $gameMessage.add(TextManager.surprise.format($gameParty.name()));
//    }
};

BattleManager.displayRewards = function() {
//    this.displayExp();
//    this.displayGold();
//    this.displayDropItems(); //不显示收益
};

Window_ActorCommand.prototype.initialize = function() {
//    var y = Graphics.boxHeight - this.windowHeight();
    var y = 0;
    Window_Command.prototype.initialize.call(this, 0, y);
    this.openness = 0;
    this.deactivate();
    this._actor = null;
};

Window_ActorCommand.prototype.windowWidth = function() {
    return Graphics.boxWidth
//    return 192;
};

Window_ActorCommand.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};

Window_ActorCommand.prototype.numVisibleRows = function() {
    return 1;
};

Window_ActorCommand.prototype.maxCols = function() {
    return 7;
};

Window_ActorCommand.prototype.makeCommandList = function() {
   if (this._actor) {
//        this.addAttackCommand();
        this.addSkillCommands();
//        this.addGuardCommand();
//        this.addItemCommand();
    }
};

Scene_Battle.prototype.startPartyCommandSelection = function() {
    this.refreshStatus();
//    this._statusWindow.deselect();
    this._statusWindow.open();
//    this._actorCommandWindow.close();  //不显示战逃选择，直接跳至行动选择
//    this._partyCommandWindow.setup();
	this.selectNextCommand();
};

Window_PartyCommand.prototype.windowWidth = function() {
    return 0;
};

Window_PartyCommand.prototype.numVisibleRows = function() {
    return 0;
};

//=======================战斗属性最小化（箭头未消去）=============================
//Window_BattleStatus.prototype.windowWidth = function() {
//    return null;
//};
//Window_BattleStatus.prototype.windowHeight = function() {
//    return null;
//};
//Window_BattleStatus.prototype.numVisibleRows = function() {
//    return null;
//};
//Window_BattleStatus.prototype.maxItems = function() {
//    return null;
//};

//=======================战斗LOG去除================================
BattleManager.isBusy = function() {
    return ($gameMessage.isBusy() || this._spriteset.isBusy());// ||
//            this._logWindow.isBusy());
};

BattleManager.startTurn = function() {
    this._phase = 'turn';
    this.clearActor();
    $gameTroop.increaseTurn();
    this.makeActionOrders();
    $gameParty.requestMotionRefresh();
//    this._logWindow.startTurn();
};

BattleManager.startAction = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    var targets = action.makeTargets();
    this._phase = 'action';
    this._action = action;
    this._targets = targets;
    subject.useItem(action.item());
    this._action.applyGlobal();
    this.refreshStatus();
//    this._logWindow.startAction(subject, action, targets);
};

BattleManager.invokeAction = function(subject, target) {
//    this._logWindow.push('pushBaseLine');
    if (Math.random() < this._action.itemCnt(target)) {
        this.invokeCounterAttack(subject, target);
    } else if (Math.random() < this._action.itemMrf(target)) {
        this.invokeMagicReflection(subject, target);
    } else {
        this.invokeNormalAction(subject, target);
    }
    subject.setLastTarget(target);
//    this._logWindow.push('popBaseLine');
    this.refreshStatus();
};

BattleManager.invokeNormalAction = function(subject, target) {
    var realTarget = this.applySubstitute(target);
    this._action.apply(realTarget);
//    this._logWindow.displayActionResults(subject, realTarget);
};

BattleManager.endAction = function() {
//    this._logWindow.endAction(this._subject);
    this._phase = 'turn';
};

BattleManager.processTurn = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    if (action) {
        action.prepare();
        if (action.isValid()) {
            this.startAction();
        }
        subject.removeCurrentAction();
    } else {
        subject.onAllActionsEnd();
        this.refreshStatus();
//        this._logWindow.displayAutoAffectedStatus(subject);
//        this._logWindow.displayCurrentState(subject);
 //       this._logWindow.displayRegeneration(subject);
        this._subject = this.getNextSubject();
    }
};

BattleManager.endTurn = function() {
    this._phase = 'turnEnd';
    this._preemptive = false;
    this._surprise = false;
    this.allBattleMembers().forEach(function(battler) {
        battler.onTurnEnd();
        this.refreshStatus();
//        this._logWindow.displayAutoAffectedStatus(battler);
//        this._logWindow.displayRegeneration(battler);
    }, this);
    if (this.isForcedTurn()) {
        this._turnForced = false;
    }
};

Scene_Battle.prototype.createDisplayObjects = function() {
    this.createSpriteset();
    this.createWindowLayer();
    this.createAllWindows();
//    BattleManager.setLogWindow(this._logWindow);
    BattleManager.setStatusWindow(this._statusWindow);
    BattleManager.setSpriteset(this._spriteset);
//    this._logWindow.setSpriteset(this._spriteset);
};

Scene_Battle.prototype.createAllWindows = function() {
//    this.createLogWindow();
    this.createStatusWindow();  
//	this.createNEWStatusWindow(); 
    this.createPartyCommandWindow();
    this.createActorCommandWindow();
    this.createHelpWindow();
    this.createSkillWindow();
    this.createItemWindow();
    this.createActorWindow();
    this.createEnemyWindow();
    this.createMessageWindow();
    this.createScrollTextWindow();
};

Scene_Battle.prototype.createStatusWindow = function() {
//    this._statusWindow = new Window_BattleStatus();
	this._statusWindow = new Window_NEWBattleStatus();
    this.addWindow(this._statusWindow);
};

Scene_Battle.prototype.createNEWStatusWindow = function() {
    this._newstatusWindow = new Window_NEWBattleStatus();
    this.addWindow(this._newstatusWindow);
};

Scene_Battle.prototype.endCommandSelection = function() {
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
//    this._statusWindow.deselect();
};

Scene_Battle.prototype.startActorCommandSelection = function() {
    this._statusWindow.show();
    this._partyCommandWindow.close();
    this._actorCommandWindow.setup(BattleManager.actor());
};

Scene_Battle.prototype.createSkillWindow = function() {
//    var wy = this._helpWindow.y + this._helpWindow.height;
//    var wh = this._newstatusWindow.y - wy;
    var wy = 0
	var wh = this._statusWindow.y - wy;
    this._skillWindow = new Window_BattleSkill(0, wy, Graphics.boxWidth, wh);
//    this._skillWindow.setHelpWindow(this._helpWindow);
    this._skillWindow.setHandler('ok',     this.onSkillOk.bind(this));
    this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);
};
//-----------------------------------------------------------------------------
// Window_NEWBattleStatus
// 战斗中的属性显示


function Window_NEWBattleStatus() {
    this.initialize.apply(this, arguments);
}

Window_NEWBattleStatus.prototype = Object.create(Window_Selectable.prototype);
Window_NEWBattleStatus.prototype.constructor = Window_NEWBattleStatus;

Window_NEWBattleStatus.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = Graphics.boxWidth - width;
    var y = Graphics.boxHeight - height;
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.openness = 0;
//	this.drawSX();
};

Window_NEWBattleStatus.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_NEWBattleStatus.prototype.windowHeight = function() {
    return this.fittingHeight(10);
};

//Window_NEWBattleStatus.prototype.refresh = function() {
//    this.contents.clear();
//    if (this._actor) {
//        var lineHeight = this.lineHeight();
//        this.drawSX(lineHeight * 14);
//    }
//};

//Window_NEWBattleStatus.prototype.drawSX = function(x, y) {
Window_NEWBattleStatus.prototype.refresh = function(x, y) {
	this.contents.clear();
	var width = this.windowWidth();
	var height = this.windowHeight();
	var x = Graphics.boxWidth - width;
	var y = 0;
	this.drawSX1(x, y);
	this.drawSX2(x + 384, y);
	this.drawsxcz(x + 384, y)
};

Window_NEWBattleStatus.prototype.drawSX1 = function(x, y) {
	var lineHeight = this.lineHeight();
    this.changeTextColor(this.systemColor());
    this.drawText("润滑", x, y + lineHeight * 0,160);
	this.drawText("恭顺", x, y + lineHeight * 1,160);
	this.drawText("欲情", x, y + lineHeight * 2,160);
	this.drawText("习得", x, y + lineHeight * 3,160);
	this.drawText("屈服", x, y + lineHeight * 4,160);
	this.drawText("羞耻", x, y + lineHeight * 5,160);
	this.drawText("痛苦", x, y + lineHeight * 6,160);
	this.drawText("恐怖", x, y + lineHeight * 7,160);
	this.drawText("反感", x, y + lineHeight * 8,160);
	this.drawText("抑郁", x, y + lineHeight * 9,160);
    this.resetTextColor();
    this.drawText($gameVariables.value(1), x + 160, y + lineHeight * 0, 160, 'left');
	this.drawText($gameVariables.value(2), x + 160, y + lineHeight * 1, 160, 'left');
	this.drawText($gameVariables.value(3), x + 160, y + lineHeight * 2, 160, 'left');
	this.drawText($gameVariables.value(4), x + 160, y + lineHeight * 3, 160, 'left');
	this.drawText($gameVariables.value(5), x + 160, y + lineHeight * 4, 160, 'left');
	this.drawText($gameVariables.value(6), x + 160, y + lineHeight * 5, 160, 'left');
	this.drawText($gameVariables.value(7), x + 160, y + lineHeight * 6, 160, 'left');
	this.drawText($gameVariables.value(8), x + 160, y + lineHeight * 7, 160, 'left');
	this.drawText($gameVariables.value(9), x + 160, y + lineHeight * 8, 160, 'left');
	this.drawText($gameVariables.value(10), x + 160, y + lineHeight * 9, 160, 'left');
};

Window_NEWBattleStatus.prototype.drawSX2 = function(x, y) {
	var lineHeight = this.lineHeight();
    this.changeTextColor(this.systemColor());
    this.drawText("口唇快感", x, y + lineHeight * 0,160);
	this.drawText("乳房快感", x, y + lineHeight * 1,160);
	this.drawText("阴蒂快感", x, y + lineHeight * 2,160);
	this.drawText("阴道快感", x, y + lineHeight * 3,160);
	this.drawText("菊穴快感", x, y + lineHeight * 4,160);
	this.drawNEWActorTp($gameParty.members()[0], x, y + lineHeight * 6);
//	this.drawActorHp($gameParty.members()[0], x, y + lineHeight * 7);
    this.drawNEWActorMp($gameParty.members()[0], x, y + lineHeight * 8);
	this.drawActorName($gameParty.members()[0], x, y + lineHeight * 9,160);
//	this.drawText("精力", x, y + lineHeight * 10,160);
    this.resetTextColor();
    this.drawText($gameVariables.value(11), x + 200, y + lineHeight * 0, 160, 'left');
	this.drawText($gameVariables.value(12), x + 200, y + lineHeight * 1, 160, 'left');
	this.drawText($gameVariables.value(13), x + 200, y + lineHeight * 2, 160, 'left');
	this.drawText($gameVariables.value(14), x + 200, y + lineHeight * 3, 160, 'left');
	this.drawText($gameVariables.value(15), x + 200, y + lineHeight * 4, 160, 'left');
};

Window_Base.prototype.drawNEWActorHp = function(actor, x, y, width) {
    width = width || 300;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x, y, 44);
    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
                           this.hpColor(actor), this.normalColor());
};

Window_Base.prototype.drawNEWActorMp = function(actor, x, y, width) {
    width = width || 300;
    var color1 = this.mpGaugeColor1();
    var color2 = this.mpGaugeColor2();
    this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.mpA, x, y, 44);
    this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
                           this.mpColor(actor), this.normalColor());
};

Window_Base.prototype.drawNEWActorTp = function(actor, x, y, width) {
    width = width || 300;
    var color1 = this.tpGaugeColor1();
    var color2 = this.tpGaugeColor2();
    this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.tpA, x, y, 44);
    this.changeTextColor(this.tpColor(actor));
    this.drawText(actor.tp, x + width - 64, y, 64, 'right');
};

Window_NEWBattleStatus.prototype.drawsxcz = function(x, y) {
	var color1 = this.textColor(0);
    var color2 = this.textColor(20);
	var lineHeight = this.lineHeight();
    var v11 = $gameVariables.value(11);
	var v12 = $gameVariables.value(12);
	var v13 = $gameVariables.value(13);
	var v14 = $gameVariables.value(14);
	var v15 = $gameVariables.value(15);
    var v2 = 10000;
	var rate11 = v11 / v2;
	var rate12 = v12 / v2;
	var rate13 = v13 / v2;
	var rate14 = v14 / v2;
	var rate15 = v15 / v2;
	var width = 300;
	var fill11 = Math.floor(width * rate11)
	var fill12 = Math.floor(width * rate12)
	var fill13 = Math.floor(width * rate13)
	var fill14 = Math.floor(width * rate14)
	var fill15 = Math.floor(width * rate15)
	this.contents.fillRect(x, y + 30 + lineHeight * 0,width,3,color1)
	this.contents.fillRect(x, y + 30 + lineHeight * 1,width,3,color1)
	this.contents.fillRect(x, y + 30 + lineHeight * 2,width,3,color1)
	this.contents.fillRect(x, y + 30 + lineHeight * 3,width,3,color1)
	this.contents.fillRect(x, y + 30 + lineHeight * 4,width,3,color1)
	this.contents.gradientFillRect(x, y + 30 + lineHeight * 0,fill11,3,color2,color2)
	this.contents.gradientFillRect(x, y + 30 + lineHeight * 1,fill12,3,color2,color2)
	this.contents.gradientFillRect(x, y + 30 + lineHeight * 2,fill13,3,color2,color2)
	this.contents.gradientFillRect(x, y + 30 + lineHeight * 3,fill14,3,color2,color2)
	this.contents.gradientFillRect(x, y + 30 + lineHeight * 4,fill15,3,color2,color2)
};

//=========================新的技能列表====================
// The window for selecting a skill on the skill screen.

function Window_NEWSkillList() {
    this.initialize.apply(this, arguments);
}

Window_NEWSkillList.prototype = Object.create(Window_Selectable.prototype);
Window_NEWSkillList.prototype.constructor = Window_NEWSkillList;

Window_NEWSkillList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this._stypeId = 0;
    this._data = [];
};

Window_NEWSkillList.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.resetScroll();
    }
};

Window_NEWSkillList.prototype.setStypeId = function(stypeId) {
    if (this._stypeId !== stypeId) {
        this._stypeId = stypeId;
        this.refresh();
        this.resetScroll();
    }
};

Window_NEWSkillList.prototype.maxCols = function() {
    return 3;
};

Window_NEWSkillList.prototype.spacing = function() {
    return 48;
};

Window_NEWSkillList.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_NEWSkillList.prototype.item = function() {
    return this._data && this.index() >= 0 ? this._data[this.index()] : null;
};

Window_NEWSkillList.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this._data[this.index()]);
};

Window_NEWSkillList.prototype.includes = function(item) {
    return item && item.stypeId === this._stypeId;
};

Window_NEWSkillList.prototype.isEnabled = function(item) {
    return this._actor && this._actor.canUse(item);
};

Window_NEWSkillList.prototype.makeItemList = function() {
    if (this._actor) {
        this._data = this._actor.skills().filter(function(item) {
            return this.includes(item);
        }, this);
    } else {
        this._data = [];
    }
};

Window_NEWSkillList.prototype.selectLast = function() {
    var skill;
    if ($gameParty.inBattle()) {
        skill = this._actor.lastBattleSkill();
    } else {
        skill = this._actor.lastMenuSkill();
    }
    var index = this._data.indexOf(skill);
    this.select(index >= 0 ? index : 0);
};

Window_NEWSkillList.prototype.drawItem = function(index) {
    var skill = this._data[index];
    if (skill) {
        var costWidth = this.costWidth();
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(skill));
        this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
//        this.drawSkillCost(skill, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};

Window_NEWSkillList.prototype.costWidth = function() {
    return this.textWidth('000');
};

//Window_NEWSkillList.prototype.drawSkillCost = function(skill, x, y, width) {
//    if (this._actor.skillTpCost(skill) > 0) {
//        this.changeTextColor(this.tpCostColor());
//        this.drawText(this._actor.skillTpCost(skill), x, y, width, 'right');
//    } else if (this._actor.skillMpCost(skill) > 0) {
//        this.changeTextColor(this.mpCostColor());
//        this.drawText(this._actor.skillMpCost(skill), x, y, width, 'right');
//    }
//};

//Window_NEWSkillList.prototype.updateHelp = function() {
//    this.setHelpWindowItem(this.item());
//};

Window_NEWSkillList.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};

//=========================战斗技能列表新==========================

function Window_BattleSkill() {
    this.initialize.apply(this, arguments);
}

Window_BattleSkill.prototype = Object.create(Window_NEWSkillList.prototype);
Window_BattleSkill.prototype.constructor = Window_BattleSkill;

Window_BattleSkill.prototype.initialize = function(x, y, width, height) {
    Window_NEWSkillList.prototype.initialize.call(this, x, y, width, height);
    this.hide();
};

Window_BattleSkill.prototype.show = function() {
    this.selectLast();
//    this.showHelpWindow();
    Window_NEWSkillList.prototype.show.call(this);
};

Window_BattleSkill.prototype.hide = function() {
//    this.hideHelpWindow();
    Window_NEWSkillList.prototype.hide.call(this);
};

