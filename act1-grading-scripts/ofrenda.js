/*
Act 1 Events Ofrenda Autograder
Intital version and testing: Saranya Turimella, Summer 2019
*/
require('../grading-scripts-s3/scratch3')

module.exports = class {
    constructor() {
        this.requirements = {};
        this.extensions = {};
    }

    initReqs() {
        this.requirements.leftSpriteSpeak = { bool: false, str: 'What the Left Sprite says has been changed' }; // done
        this.requirements.leftSpriteCostume = { bool: false, str: 'The costume of the Left Sprite has been changed' }; // done
        this.requirements.rightChanged = { bool: false, str: 'The costumes of the Right Sprite has been changed' }; // done
        this.requirements.middleChanged = { bool: false, str: 'The costumes of the Middle Sprite has been changed' }; // done
        this.requirements.usesClickRight = { bool: false, str: 'The Right Sprite uses the "when this sprite clicked" block' }; // done
        this.requirements.usesClickMiddle = { bool: false, str: 'The Middle Sprite uses the "when this sprite clicked" block' }; // done
        this.requirements.usesSayRight = { bool: false, str: 'The Right Sprite uses a "say" block' }; // done
        this.requirements.usesSayMiddle = { bool: false, str: 'The Middle Sprite uses a "say" block' }; // done
        this.extensions.usesPlaySoundUntilDone = {bool: true, str: 'The project uses the "Play Sound Until" block in a script'};
        this.extensions.usesGotoXY = {bool: true, str: 'The project uses the "Go to XY" block in a script'};
        this.extensions.keyCommand= {bool: true, str: 'The project uses a "when "key" pressed" block in a script'};
    }

    grade(fileObj, user) {
        var project = new Project(fileObj, null);
        var original = new Project(require('../act1-grading-scripts/originalOfrenda-test'), null);

        this.initReqs();
        if (!is(fileObj)) return;

        let origCostumeLeft = 0;
        let newCostumeLeft = 0;
        let origCostumeRight = 0;
        let origCostumeMiddle = 0;
        let newCostumeRight = 0;
        let newCostumeMiddle = 0;
        let oldWordsLeft = '';
        let newWordsLeft = '';
        let rightUsesSay = false;
        let middleUsesSay = false;
        let rightUsesClick = false;
        let middleUsesClick = false;
        let leftSizeChanges = false;
        let rightSizeChanges = false;
        let middleSizeChanges = false;

        // original
        for (let origTarget of original.targets) {
            if (origTarget.name === 'Left') {
                origCostumeLeft = origTarget.currentCostume;
                for (let block in origTarget.blocks) {
                    if (origTarget.blocks[block].opcode === 'looks_sayforsecs') {
                        oldWordsLeft = origTarget.blocks[block].inputs.MESSAGE[1][1];
                    }
                }
            }
            if (origTarget.name === 'Right') {
                origCostumeRight = origTarget.currentCostume;
            }
            if (origTarget.name === 'Middle') {
                origCostumeMiddle = origTarget.currentCostume;
            }
        }

        // new
        for (let target of project.targets) {
            if (target.name === 'Left') {
               
                newCostumeLeft = target.currentCostume;
                for (let block in target.blocks) {
                    if (target.blocks[block].opcode === 'looks_sayforsecs') {
                        newWordsLeft = target.blocks[block].inputs.MESSAGE[1][1];
                    }
                    if (target.blocks[block].opcode === 'looks_changesizeby') {
                        leftSizeChanges = true;
                    }
                    if (target.blocks[block].opcode === 'sound_playuntildone') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesPlaySoundUntilDone.bool = false;
                        }
                    }
                    if (target.blocks[block].opcode === 'motion_gotoxy') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesGotoXY.bool = false;
                        }
                    }
                    if (target.blocks[block].opcode === 'event_whenkeypressed') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesGotoXY.bool = false;
                        }
                    }
                }
            }
            if (target.name === 'Right') {
                newCostumeRight = target.currentCostume;
                for (let block in target.blocks) {
                
                    if (target.blocks[block].opcode === 'event_whenthisspriteclicked') {
                        if (target.blocks[block].next !== null) {
                            rightUsesClick = true;
                        }
                    }
                    if ((target.blocks[block].opcode === 'looks_sayforsecs') ||
                     (target.blocks[block].opcode === 'looks_say')) {
                         if (target.blocks[block].parent !== null) {
                             rightUsesSay = true;
                         }
                     }
                     if (target.blocks[block].opcode === 'looks_changesizeby') {
                        rightSizeChanges = true;
                    }
                    if (target.blocks[block].opcode === 'sound_playuntildone') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesPlaySoundUntilDone.bool = false;
                        }
                    }
                    if (target.blocks[block].opcode === 'motion_gotoxy') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesGotoXY.bool = false;
                        }
                    }
                    if (target.blocks[block].opcode === 'event_whenkeypressed') {
                        console.log('in right when key is pressed') 
                        console.log(target.blocks[block].next);
                        console.log(target.blocks[block].parent)
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesGotoXY.bool = false;
                        }
                    }

                }
            }

            if (target.name === 'Middle') {
                newCostumeMiddle = target.currentCostume;
                for (let block in target.blocks) {
            
                    if (target.blocks[block].opcode === 'event_whenthisspriteclicked') {
                        let nextBlock = target.blocks[block].next;
                      
                        if (target.blocks[block].next !== null) {
                           if (target.blocks[nextBlock].opcode !== "looks_gotofrontback") {
                               let nextnextBlock = target.blocks[nextBlock].next;
                               if (target.blocks[nextnextBlock].next !== null) {
                                   middleUsesClick = true;
                               }
                           } 
                           if(target.blocks[nextBlock].next !== null) {
                               middleUsesClick = true;
                           }
                        
                        }
                    }
                    if ((target.blocks[block].opcode === 'looks_sayforsecs') ||
                     (target.blocks[block].opcode === 'looks_say')) {
                         if (target.blocks[block].parents !== null) {
                             middleUsesSay = true;
                         }
                     }
                     if (target.blocks[block].opcode === 'looks_changesizeby') {
                        middleSizeChanges = true;
                    }
                    if (target.blocks[block].opcode === 'sound_playuntildone') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesPlaySoundUntilDone.bool = false;
                        }
                    }
                    if (target.blocks[block].opcode === 'motion_gotoxy') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesGotoXY.bool = false;
                        }
                    }
                    if (target.blocks[block].opcode === 'event_whenkeypressed') {
                        if (target.blocks[block].next === null && target.blocks[block].parent === null) {
                            this.extensions.usesGotoXY.bool = false;
                        }
                    }
                }
            }
        }

        if (rightUsesClick) {
            this.requirements.usesClickRight.bool = true;
        }

        if (middleUsesClick) {
            this.requirements.usesClickMiddle.bool = true;
        }

        if (rightUsesSay) {
            this.requirements.usesSayRight.bool = true;
        }

        if (middleUsesSay) {
            this.requirements.usesSayMiddle.bool = true;
        }
        
        if (origCostumeLeft !== newCostumeLeft || leftSizeChanges) {
            this.requirements.leftSpriteCostume.bool = true;
        }

        if (origCostumeRight !== newCostumeRight || rightSizeChanges) {
            this.requirements.rightChanged.bool = true;
        }

        if (origCostumeMiddle !== newCostumeMiddle || middleSizeChanges) {
            this.requirements.middleChanged.bool = true;
        }

        if (oldWordsLeft !== newWordsLeft) {
            this.requirements.leftSpriteSpeak.bool = true;
        }
    }
}