import { useState } from 'react';
import './App.css';
import * as Parser from './parser/formula-parser.js';
import Expr from './Element/Expr.js';
const parse = Parser.parse;

function App() {
  let [formula, formulaChange] = useState('($b + SQRT (SQR($b) - 4 * $a)) / (2 * $a)');
  let [syntaxTree, syntaxTreeChange] = useState('');
  let [syntaxTreeJson, syntaxTreeJsonChange] = useState(null);
  let [visualizerOutput, visualizerChange] = useState('');


  const updateAst = () => {
    console.log('creating ast view...');
    const newSyntaxTree = parse(formula);
    syntaxTreeChange(newSyntaxTree);

    console.log('The ast is: ', syntaxTree);
    syntaxTreeJsonChange(JSON.stringify(newSyntaxTree, null, 2));
  };

  const deleteNode = (tree, path) => {
  	const subPaths = path.slice(2,path.length).split('.');
    for (let i = 0; i < subPaths.length - 1; i++) {
      if(subPaths[i].includes('arguments')){
        let subTree = tree.arguments;
        const matchIndex = subPaths[i].match(/\[(.*?)\]/)[1]; //get the index of the subtree to modify
        tree = subTree[matchIndex]; //set the subtree to modify
      }else{
      tree = tree[subPaths[i]];//get the tree at the parent node
      }
    }
    tree[subPaths[subPaths.length - 1]] = null; // delete the current node
    
  }

  const updateSyntaxTree = (path) => {
    //function to update syntax tree after deleting the node
    deleteNode(syntaxTree, path);
    syntaxTreeJsonChange(JSON.stringify(syntaxTree, null, 2));
  }

  const convertAstToFormula = () => {     
    const generatedFormula = generateFormula(syntaxTree,0);   
    visualizerChange(generatedFormula);//setting to visualizer
  
  };

  const generateFormula = (tree, idPath) => {
    if(!tree || tree.length === 0) return ;
    switch(tree.type) {
      case 'PAREN': // expressions case
          return (<div className='formula' id={idPath = idPath + '.expression'}>( {generateFormula(tree.expression, idPath)} )</div>);
      case 'FUNCTION': //function with arguments
            let args = tree.arguments;
            for(let i=0;i<args.length;i++){
              idPath = idPath + '.arguments[' + i + ']';
            // let nameValue = tree.name =="SQRT" ? '^2' : '^3'; to handle the function name substitution
          return <div className='formula' id={idPath}>{tree.name + '(' }  {generateFormula(tree.arguments[i], idPath)} {')'}</div>;
            }
      case 'ADDITION': //left and right operations
        let idAddPath = idPath;
          return (
            <div className='formula' id={idAddPath}>
             <Expr id={idPath = idAddPath + '.left'} processExpr={generateFormula(tree.left, idPath)} updateSyntaxTree={updateSyntaxTree} />
              +
             <Expr id={idPath = idAddPath + '.right'} processExpr={generateFormula(tree.right, idPath)} updateSyntaxTree={updateSyntaxTree} />
            </div>
         );
      case 'SUBTRACTION':
        let idSubPath = idPath;
          return (
            <div className='formula' id={idSubPath}>
              <Expr id={idPath = idSubPath + '.left'} processExpr={generateFormula(tree.left, idPath)} updateSyntaxTree={updateSyntaxTree} />
                -
              <Expr id={idPath = idSubPath+ '.right'} processExpr={generateFormula(tree.right, idPath)} updateSyntaxTree={updateSyntaxTree} />
            </div>
          );
      case 'MULTIPLICATION':
        let idMulPath = idPath;
          return (
            <div className='formula' id={idMulPath}>
              <Expr id={idPath = idMulPath +'.left'} processExpr={generateFormula(tree.left, idPath)} updateSyntaxTree={updateSyntaxTree} />
              *
              <Expr id={idPath = idMulPath + '.right'} processExpr={generateFormula(tree.right, idPath)} updateSyntaxTree={updateSyntaxTree} />
            </div>
          );
      case 'DIVISION':
        let idDivPath = idPath;
          return (
            <div className='formula' id={idDivPath}>
              <Expr id={idPath = idDivPath + '.left'} processExpr={generateFormula(tree.left, idPath)} updateSyntaxTree={updateSyntaxTree} />
              /
              <Expr id={idPath = idDivPath + '.right'} processExpr={generateFormula(tree.right, idPath)} updateSyntaxTree={updateSyntaxTree} />
              </div>
            );
      case 'NEGATION':
          return (<div className='formula' id={idPath}>-{tree.expression.value}</div>);
      case 'PI':
          return (<div className='formula' id={idPath}>{tree.type}</div>);
      case 'VARIABLE':
          return (<div className='variable' id={idPath}>{tree.name}</div>);
      case 'NUMBER':
          return (<div className='variable' id={idPath}>{tree.value}</div>);
    }
} 

  return (
    <div className='formulizer'>
      <h1>Welcome to the formulizer!</h1>
      <h3>Input formula</h3>
      <p>
        <textarea 
          cols={100} 
          rows={8} 
          value={formula} 
          onChange={(event) => formulaChange(event.target.value)}/> <br/>
      </p>
      <p><button onClick={updateAst}>Parse and update AST View</button></p>
      <h3>Syntax tree</h3>
      <pre style={{maxHheight: '300px', overflowy: 'auto',backgroundColor: '#eeeeee'}}>{syntaxTreeJson}</pre>
      <p><button onClick={convertAstToFormula}>Convert AST to Formula</button></p>
      <h3>Visualizer-to-Formula</h3>
      <p>{visualizerOutput}</p>
    </div>
  );
}

export default App;
