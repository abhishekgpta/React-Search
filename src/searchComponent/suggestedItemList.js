import React, {Component} from 'react';

export default class SuggestionList extends Component{
	

	render(){
		let {items, itemProps,
      highlightedItemIndex} = this.props;
		return(
			<ul role="listbox" className="locus__suggestions-list" >
			{	items.map((item,itemIndex)=>{
					const ishighlight = itemIndex===highlightedItemIndex;
					const itemPropsObj = itemProps({itemIndex});
					const allProps={
						'aria-selected': ishighlight,
						...itemPropsObj
					}
					return item.id? <li id={`locus-search-${itemIndex}`}className={ishighlight?"locus__suggestion-highlighted focused":""}
					role="option" aria-selected={ishighlight} key={`locus-Search-${itemIndex}`} {...allProps}>
						<div style={{    padding: "10px"}}>
						<h4 style={{marginBottom:"0px"}}>ID:{item.id}</h4>
						<div>{item.name}</div>
						<div>
						address: <i>{item.address}</i>
						</div>
						<div>
						pincode: {item.pincode}
						</div>
						</div>
					</li>:<li className={ishighlight?"locus__suggestion-highlighted":""} key={`locus-Search-${itemIndex}`} {...allProps}>{item}</li>
				})
			}
			</ul>
		)
	}
}