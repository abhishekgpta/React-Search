import React, {Component} from 'react';
import SuggestionList from './suggestedItemList';
export default class SearchInput extends Component{
	constructor(props){
		super(props);
		this.state={
			isInputFocused: false
		}
	}
	renderItems() {
    const { items } = this.props;

    if (items.length === 0) {
      return null;
    }

    // const { theme } = this;
    const {
      id, renderItem, renderItemData,
      highlightedItemIndex, itemProps
    } = this.props;
    return (
      <SuggestionList
        items={items}
        itemProps={itemProps}
        renderItem={renderItem}
        renderItemData={renderItemData}
        highlightedItemIndex={ highlightedItemIndex }
        onHighlightedItemChange={this.onHighlightedItemChange}
        getItemId={this.getItemId}
        // theme={theme}
        keyPrefix={`react-autowhatever-${id}-`}
      />
    );
  }
	onKeyDown = event => {
	    const { inputProps, highlightedItemIndex } = this.props;
	    switch (event.key) {
	      case 'ArrowDown':
	      {
	        let newHighlightedItemIndex=null;
	        if(highlightedItemIndex === null){
	        	newHighlightedItemIndex=0;
	        }
	        else if(highlightedItemIndex < this.props.items.length-1){
	        	newHighlightedItemIndex = highlightedItemIndex+1;
	        }
	        else{
	        	newHighlightedItemIndex= 0;
	        }
	        inputProps.onKeyDown(event, {  newHighlightedItemIndex });
	        break;
	      }
	      case 'ArrowUp': {
	        let newHighlightedItemIndex=null;
	        if(highlightedItemIndex === null){
	        	newHighlightedItemIndex=0;
	        }
	        else if(highlightedItemIndex >0){
	        	newHighlightedItemIndex = highlightedItemIndex-1;
	        }
	        else{
	        	newHighlightedItemIndex= this.props.items.length-1;
	        }
	        inputProps.onKeyDown(event, {  newHighlightedItemIndex });
	        break;
	      }

	      default:
	        inputProps.onKeyDown(event, {  highlightedItemIndex });
	    }
	  };
	render(){
		 const renderedItems =  this.renderItems();
		     const { items } = this.props;
		     const highlightedItemIndex =this.props.highlightedItemIndex;
		const containerProps = {
      role: 'combobox',
      'aria-haspopup': 'listbox',
      // 'aria-owns': itemsContainerId,
      // 'aria-expanded': isOpen,
      
      ...this.props.containerProps
    };
    const inputComponentProps={
      type: 'text',
      value: '',
      autoComplete: 'off',
      'aria-autocomplete': 'list',
       ...this.props.inputProps,
       onKeyDown:this.onKeyDown
    }
    const itemsContainer = {
        role: 'listbox',
    };
		return <div className="locus__search__container" 
		role="combobox" aria-haspopup="listbox" aria-owns="locus__searchSuggestion" aria-expanded="true">
			<input {...inputComponentProps} className="locus-Search__input" 
			aria-activedescendant={`locus-search-${highlightedItemIndex}`}
			aria-controls="locus__searchSuggestion"
			aria-autocomplete="list"/>
			<div {...itemsContainer} id="locus__searchSuggestion" className={items.length > 0?"locus-autosuggest-container--open locus__searchSuggestion__container":"locus__searchSuggestion__container"}

			  style={{position:"absolute"}}>{renderedItems}</div>
		</div>
	}
}