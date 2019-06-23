import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SearchInput from './searchInput';
export default class SearchComponent extends Component{
	constructor(props){
		super(props);
		this.state = {
	      isFocused: false,
	      isCollapsed: true,
	      highlightedSuggestionIndex: null,
	      highlightedSuggestion: null,
	      valueBeforeUpDown: null
    	};
	}
	
  	  updateHighlightedSuggestion( suggestionIndex, prevValue) {
    this.setState(state => {
      let { valueBeforeUpDown } = state;

      if (suggestionIndex === null) {
        valueBeforeUpDown = null;
      } else if (
        valueBeforeUpDown === null &&
        typeof prevValue !== 'undefined'
      ) {
        valueBeforeUpDown = prevValue;
      }

      return {
        highlightedSuggestionIndex: suggestionIndex,
        highlightedSuggestion:
          suggestionIndex === null
            ? null
            : this.getSuggestion( suggestionIndex),
        valueBeforeUpDown
      };
    });
  }
	itemProps = ({ itemIndex }) => {
    return {
      'data-suggestion-index': itemIndex,
      onMouseEnter: this.onSuggestionMouseEnter,
      onMouseLeave: this.onSuggestionMouseLeave,
      onMouseDown: this.onSuggestionMouseDown,
      onTouchStart: this.onSuggestionTouchStart,
      onTouchMove: this.onSuggestionTouchMove,
      onClick: this.onSuggestionClick
    };
  };
	maybeCallOnChange(event, newValue, method) {
    const { value, onChange } = this.props.inputProps;
    if (newValue !== value) {
      onChange(event, { newValue, method });
    }
  }
  getSuggestion( suggestionIndex) {
    const { suggestions } = this.props;

    return suggestions[suggestionIndex];
  }
  getHighlightedSuggestion() {
    const { highlightedSuggestionIndex } = this.state;

    if (highlightedSuggestionIndex === null) {
      return null;
    }
    return this.getSuggestion(
      highlightedSuggestionIndex
    );
  }
  getSuggestionIndices(suggestionElement) {
    const sectionIndex = suggestionElement.getAttribute('data-section-index');
    const suggestionIndex = suggestionElement.getAttribute(
      'data-suggestion-index'
    );

    return {
      sectionIndex:
        typeof sectionIndex === 'string' ? parseInt(sectionIndex, 10) : null,
      suggestionIndex: parseInt(suggestionIndex, 10)
    };
  }
  getSuggestionValueByIndex(suggestionIndex) {
    const { getSuggestionValue } = this.props;
    return getSuggestionValue(
      this.getSuggestion( suggestionIndex)
    );
  }
  findSuggestionElement(startNode) {
    let node = startNode;

    do {
      if (node.getAttribute('data-suggestion-index') !== null) {
        return node;
      }

      node = node.parentNode;
    } while (node !== null);

    throw new Error("Couldn't find suggestion element");
  }
  onSuggestionClick = event => {
      const targetElement = this.findSuggestionElement(event.target)
     const suggestionIndex= parseInt(targetElement.getAttribute('data-suggestion-index'),10);
    const clickedSuggestion = this.getSuggestion( suggestionIndex);
    const clickedSuggestionValue = this.props.getSuggestionValue(
      clickedSuggestion
    );

    this.maybeCallOnChange(event, clickedSuggestionValue, 'click');
    
      this.closeSuggestions();
    
  };
  onSuggestionSelected = (event, data) => {
 
  };
  revealSuggestions() {
    this.setState({
      isCollapsed: false
    });
  }	
   closeSuggestions() {
    this.setState({
      highlightedSectionIndex: null,
      highlightedSuggestionIndex: null,
      highlightedSuggestion: null,
      valueBeforeUpDown: null,
      isCollapsed: true
    });
  }
	render(){
		const {
			suggestions,
			onSuggestionsFetchRequested,
			renderSuggestion,
			inputProps,
			id,
			getSuggestionValue,
		} = this.props;
		const { value, onFocus, onKeyDown } = inputProps;
		const {
			isFocused,
			isCollapsed,
			// highlightedSectionIndex,
			highlightedSuggestionIndex,
			valueBeforeUpDown
		} = this.state;
		const isOpen=isFocused && !isCollapsed;

		const searchInputProps={
			...inputProps,
			onChange:event=>{
				const { value } = event.target;
				this.maybeCallOnChange(event, value, 'type')
				onSuggestionsFetchRequested({ value, reason: 'input-changed' });
				 this.revealSuggestions();
			},
			onFocus:event=>{
				this.setState({
					isFocused:true,
				})
			},
			onKeyDown:(event,data)=>{
				const { keyCode,key } = event;

				switch(key){
					case "ArrowDown":
					case "ArrowUp":{
						if(isCollapsed){
							if(value.trim().length > 0){

							onSuggestionsFetchRequested({
			                  value,
			                  reason: 'suggestions-revealed'
			                });
			                this.revealSuggestions();
							}
						}
						else{
						const {
						newHighlightedItemIndex
						} = data;
						let newValue;
						if (newHighlightedItemIndex === null) {
						// valueBeforeUpDown can be null if, for example, user
						// hovers on the first suggestion and then pressed Up.
						// If that happens, use the original input value.
						newValue =value 
						} else {
						newValue = this.getSuggestionValueByIndex(
						newHighlightedItemIndex
						);
						}
						this.updateHighlightedSuggestion(
						newHighlightedItemIndex,
						value
						);
						this.maybeCallOnChange(
		                event,
		                newValue,
		                keyCode === 40 ? 'down' : 'up'
		              );
						}

            			event.preventDefault(); // Prevents the cursor from moving

						break;
					}
					case "Enter":{
						const highlightedSuggestion = this.getHighlightedSuggestion();
						if (isOpen ) {
              				this.closeSuggestions();
            			}
            			if (highlightedSuggestion != null) {
			              const newValue = getSuggestionValue(highlightedSuggestion);

			              this.maybeCallOnChange(event, newValue, 'enter');

			              this.onSuggestionSelected(event, {
			                suggestion: highlightedSuggestion,
			                suggestionValue: newValue,
			                suggestionIndex: highlightedSuggestionIndex,
			                method: 'enter'
			              });

			              this.justSelectedSuggestion = true;

			              setTimeout(() => {
			                this.justSelectedSuggestion = false;
			              });
			            }
						break;
					}
					case "Escape":{
						if (isOpen) {
			              // If input.type === 'search', the browser clears the input
			              // when Escape is pressed. We want to disable this default
			              // behaviour so that, when suggestions are shown, we just hide
			              // them, without clearing the input.
			              event.preventDefault();
			            }
						if (isOpen) {
			              this.props.onSuggestionsClearRequested();
			              this.closeSuggestions();
			            } else {
			              // this.resetHighlightedSuggestion();
			            }
			              break;
					}
				}
			},
			onBlur:(event)=>{
	 			
			}
		}
		const items=isOpen?suggestions:[];
		return <SearchInput 
        items={items}
        renderItem={renderSuggestion}
        highlightedItemIndex={highlightedSuggestionIndex}
        inputProps={searchInputProps}
        itemProps={this.itemProps}
        id={id}
        ref={this.storeAutowhateverRef}
		/>
	}
}

SearchComponent.propTypes={
	suggestions:PropTypes.array.isRequired,
	handleSuggestionSelected:PropTypes.func,
	inputComponent:PropTypes.func,
	getSuggestionValue: PropTypes.func.isRequired,

}