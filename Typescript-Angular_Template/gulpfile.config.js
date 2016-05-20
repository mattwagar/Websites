'use strict';
var GulpConfig = (function () {
    function gulpConfig() {
        //Got tired of scrolling through all the comments so removed them
        //Don't hurt me AC :-)
        this.source = './src/';
        this.sourceApp = this.source + 'app/';

        this.tsOutputPath = this.source + '/js';
        this.allJavaScript = [this.source + 'js/**/*.js'];
        this.allTypeScript = this.sourceApp + '**/*.ts';

        this.typings = './tools/typings/';
        this.libraryTypeScriptDefinitions = './tools/**/*.ts';
        this.libraryDTS = './src/definitions/**/*.ts';

        this.sassOptions = {
            errLogToConsole: true,
            outputStyle: 'expanded'
        };
        this.tsFormatOptions = {
            IndentSize: 2,
            TabSize: 2,
            NewLineCharacter: "\n",
            ConvertTabsToSpaces: true,
            InsertSpaceAfterCommaDelimiter: true,
            InsertSpaceAfterSemicolonInForStatements: true,
            InsertSpaceBeforeAndAfterBinaryOperators: true,
            InsertSpaceAfterKeywordsInControlFlowStatements: true,
            InsertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
            InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
            PlaceOpenBraceOnNewLineForFunctions: false,
            PlaceOpenBraceOnNewLineForControlBlocks: false
        }
        
        this.sassInput = this.source + 'content/**/*.scss';
        this.cssOutput = this.source + './css';
    }
    return gulpConfig;
})();
module.exports = GulpConfig;
