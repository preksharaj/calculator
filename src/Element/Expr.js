import React, { useState} from 'react'
import './Expr.css'

const Element = ({ id, processExpr, updateSyntaxTree }) => {
    const [deleteExpr, SetDeleteExpr] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
  //Add functionality for delete dv highlight when hovered
    const handleMouseEnter = (e) => {
        setShowDeleteButton(true);
        setIsHighlighted(true);
      };
    
      const handleMouseLeave = (e) => {
        setShowDeleteButton(false);
        setIsHighlighted(false);
      };
    
      const handleDeleteClick = (e) => {
        SetDeleteExpr(true);
        updateSyntaxTree(id);
      };
  

    return (
        <div>
            {deleteExpr?
              null
              :
              <div
                className="container"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className={isHighlighted ? 'highlighted' : ''} id={id}>{processExpr}</div>
                  {showDeleteButton && (
                    <div className="delete-button" onClick={handleDeleteClick}>X</div>
                  )}
              </div>
            }
        </div>
    )
}

export default Element