(function()
{
	/**
	 * Overrides gear image URL.
	 */
	Sidebar.prototype.gearImage = GRAPH_IMAGE_PATH + '/clipart/Gear_128x128.png';
	
	/**
	 * Specifies special libraries that are loaded via dynamic JS.
	 */
	mxStencilRegistry.libraries['bpmn'] = ['shapes/bpmn/mxBpmnShape2.js', STENCIL_PATH + '/bpmn.xml'];

	/**
	 * Toggle palette.
	 */
	Sidebar.prototype.togglePalettes = function(prefix, ids)
	{
		for (var i = 0; i < ids.length; i++)
		{
			this.togglePalette(prefix + ids[i]);
		}
	};

	/**
	 * Toggle palette.
	 */
	Sidebar.prototype.togglePalette = function(id)
	{
		var elts = this.palettes[id];
		
		if (elts != null)
		{
			var vis = (elts[0].style.display == 'none') ? 'block' : 'none';
			
			for (var i = 0; i < elts.length; i++)
			{
				elts[i].style.display = vis;
			}
		}
	};

	// Replaces the sidebar
	Sidebar.prototype.init = function()
	{
		var imgDir = GRAPH_IMAGE_PATH;
		var dir = STENCIL_PATH;
		var signs = this.signs;
		var mockups = this.mockups;
		var ee = this.ee;
		var pids = this.pids;

		this.addGeneralPalette(true);
		this.addIconfinder();
		this.addUmlPalette(false);

		this.addBpmnPalette(dir, false);
		this.addStencilPalette('flowchart', 'Flowchart', dir + '/flowchart.xml',
			';fillColor=#ffffff;strokeColor=#000000;strokeWidth=2');
		this.addStencilPalette('basic', mxResources.get('basic'), dir + '/basic.xml',
			';fillColor=#ffffff;strokeColor=#000000;strokeWidth=2');
		this.addStencilPalette('arrows', mxResources.get('arrows'), dir + '/arrows.xml',
			';fillColor=#ffffff;strokeColor=#000000;strokeWidth=2');

		for (var i = 0; i < signs.length; i++)
		{
			this.addStencilPalette('signs' + signs[i], 'Signs / ' + signs[i],
				dir + '/signs/' + signs[i].toLowerCase() + '.xml',
				';fillColor=#000000;strokeColor=none');
		}
		
		for (var i = 0; i < mockups.length; i++)
		{
			this.addStencilPalette('ui' + mockups[i], 'Mockup / ' + mockups[i],
				dir + '/mockup/' + mockups[i].toLowerCase().replace(/ /g, '_') + '.xml');
		}
		
		for (var i = 0; i < ee.length; i++)
		{
			this.addStencilPalette('electrical' + ee[i], 'Electrical / ' + ee[i],
				dir + '/electrical/' + ee[i].toLowerCase().replace(/ /g, '_') + '.xml',
				';fillColor=white;strokeColor=black');
		}

		// Adds AWS stencils
		this.addStencilPalette('awsCompute', 'AWS / Compute', dir + '/aws/compute.xml', ';fillColor=#FF9800;strokeColor=none');
		this.addStencilPalette('awsContentDelivery', 'AWS / Content Delivery', dir + '/aws/content_delivery.xml', ';fillColor=#1EA4DD;strokeColor=none');
		this.addStencilPalette('awsDatabase', 'AWS / Database', dir + '/aws/database.xml', ';fillColor=#6F2D6E;strokeColor=none');
		this.addStencilPalette('awsDeploymentManagement', 'AWS / Deployment Management', dir + '/aws/deployment_management.xml', ';fillColor=#296934;strokeColor=none');
		this.addStencilPalette('awsGroups', 'AWS / Groups', dir + '/aws/groups.xml');
		this.addStencilPalette('awsMessaging', 'AWS / Messaging', dir + '/aws/messaging.xml', ';fillColor=#B8B58A;strokeColor=none');
		this.addStencilPalette('awsMisc', 'AWS / Misc', dir + '/aws/misc.xml', ';fillColor=#F7981F;strokeColor=none');
		this.addStencilPalette('awsNetworking', 'AWS / Networking', dir + '/aws/networking.xml', ';fillColor=#262261;strokeColor=none');
		this.addStencilPalette('awsNonServiceSpecific', 'AWS / Non Service Specific', dir + '/aws/non_service_specific.xml', ';fillColor=#C5C7C9;strokeColor=none');
		this.addStencilPalette('awsOnDemandWorkforce', 'AWS / On Demand Workforce', dir + '/aws/on_demand_workforce.xml', ';fillColor=#C5C7C9;strokeColor=none');
		this.addStencilPalette('awsStorage', 'AWS / Storage', dir + '/aws/storage.xml', ';fillColor=#146EB4;strokeColor=none');

		for (var i = 0; i < pids.length; i++)
		{
			this.addStencilPalette('pid' + pids[i], 'P&ID / ' + pids[i],
				dir + '/pid/' + pids[i].toLowerCase().replace(' ', '_') + '.xml',
				';fillColor=#ffffff;strokeColor=#000000');
		}
		
		this.addStencilPalette('leanMapping', 'Lean Mapping', dir + '/lean_mapping.xml', ';fillColor=#ffffff;strokeColor=#000000;strokeWidth=2');
		this.addMoreShapes();
	};
	
	// Adds the more shapes entry
	Sidebar.prototype.addMoreShapes = function()
	{
		var elt = this.createTitle(mxResources.get('moreShapes') + '...');
		this.container.appendChild(elt);
		
		// Block handling as link in IE
		mxEvent.addListener(elt, 'click', function(evt)
		{
			mxEvent.consume(evt);
		});
		
		this.moreShapes = elt;
 	};
 	
	// Adds the iconfinder library
	Sidebar.prototype.addIconfinder = function()
	{
		// TODO: Fix delayed typing, occasional error in library creation in
		// quirks mode
		var elt = this.createTitle(mxResources.get('images'));
		this.container.appendChild(elt);
		
		var div = document.createElement('div');
		div.className = 'geSidebar';
	    div.style.display = 'none';
		div.style.overflow = 'hidden';
		div.style.width = '100%';
		div.style.padding = '0px';
		
		var inner = document.createElement('div');
		inner.className = 'geTitle';
		inner.style.backgroundColor = 'transparent';
		inner.style.borderColor = 'transparent';
		inner.style.padding = '4px';
		inner.style.textOverflow = 'clip';
		inner.style.cursor = 'default';
		
		if (!mxClient.IS_VML)
		{
			inner.style.paddingRight = '20px';
		}

		var searchResource = mxResources.get('search');
		
		var input = document.createElement('input');
		input.setAttribute('type', 'text');
		input.value = searchResource;
		input.style.border = 'solid 1px #d5d5d5';
		input.style.width = '100%';
		input.style.backgroundImage = 'url(' + IMAGE_PATH + '/clear.gif)';
		input.style.backgroundRepeat = 'no-repeat';
		input.style.backgroundPosition = '100% 50%';
		input.style.paddingRight = '14px';
		inner.appendChild(input);

		var cross = document.createElement('div');
		cross.setAttribute('title', mxResources.get('reset'));
		cross.style.position = 'relative';
		cross.style.left = '-16px';
		cross.style.width = '12px';
		cross.style.height = '14px';
		cross.style.cursor = 'pointer';

		// Workaround for inline-block not supported in IE
		cross.style.display = (mxClient.IS_VML) ? 'inline' : 'inline-block';
		cross.style.top = ((mxClient.IS_VML) ? 0 : 3) + 'px';
		
		// Needed to block event transparency in IE
		cross.style.background = 'url(' + IMAGE_PATH + '/transparent.gif)';
		
		var find;

		mxEvent.addListener(cross, 'click', function()
		{
			input.value = '';
			find();
			input.focus();
		});
		
		inner.appendChild(cross);
		div.appendChild(inner);

		var center = document.createElement('center');
		var button = mxUtils.button(searchResource, function()
		{
			find();
		});
		button.setAttribute('disabled', 'true');
		// Workaround for inherited line-height in quirks mode
		button.style.lineHeight = 'normal';
		center.style.paddingTop = '4px';
		center.style.marginBottom = '12px';
		
		center.appendChild(button);
		div.appendChild(center);
		
		var searchTerm = '';
		var modified = false;
		var active = false;
		var complete = false;
		var page = 0;
		var count = 25;
		
		function clearDiv()
		{
			var child = div.firstChild;
			
			while (child != null)
			{
				var next = child.nextSibling;
				
				if (child != inner && child != center)
				{
					child.parentNode.removeChild(child);
				}
				
				child = next;
			}
		};
		
		find = mxUtils.bind(this, function(callback)
		{
			if (input.value != '' || (!modified && input.value == searchResource))
			{
				if (button.getAttribute('disabled') != 'true')
				{
					if (center.parentNode != null)
					{
						if (searchTerm != input.value)
						{
							clearDiv();
							searchTerm = input.value;
							complete = false;
							page = 0;
						}
						
						if (!active)
						{
							button.style.cursor = 'wait';
							button.innerHTML = mxResources.get('loading') + '...';
							active = true;
							mxUtils.get(ICONFINDER_PATH + '?q=' + encodeURIComponent(searchTerm) + '&c=' + count +
									'&p=' + page, mxUtils.bind(this, function(req)
							{
								active = false;
								page++;
								center.parentNode.removeChild(center);
								var icons = req.getXml().getElementsByTagName('icon');
								
								for (var i = 0; i < icons.length; i++)
								{
									var size = null;
									var url = null;
									var child = icons[i].firstChild;
									
									while (child != null && (size == null || url == null))
									{
										if (child.nodeName == 'size')
										{
											size = parseInt(mxUtils.getTextContent(child));
										}
										else if (child.nodeName == 'image')
										{
											url = mxUtils.getTextContent(child);
										}
		
										child = child.nextSibling;
									}
									
									if (size != null && url != null)
									{
										div.appendChild(this.createVertexTemplate('shape=image;image=' + url, size, size, ''));
									}
								}
								
								if (icons.length < count)
								{
									button.setAttribute('disabled', 'true');
									button.innerHTML = mxResources.get('noMoreResults');
									complete = true;
								}
								else
								{
									button.innerHTML = mxResources.get('moreResults');
								}
								
								button.style.cursor = '';
								
								if (icons.length == 0 && page == 1)
								{
									var err = document.createElement('div');
									err.className = 'geTitle';
									err.style.backgroundColor = 'transparent';
									err.style.borderColor = 'transparent';
									err.style.padding = '4px';
									err.style.textAlign = 'center';
									err.style.cursor = 'default';
									
									mxUtils.write(err, mxResources.get('noResultsFor', [searchTerm]));
									div.appendChild(err);
								}
								
								div.appendChild(center);
							},
							function()
							{
								button.style.cursor = '';
							}));
						}
					}
				}
			}
			else
			{
				clearDiv();
				searchTerm = '';
				button.innerHTML = searchResource;
				button.setAttribute('disabled', 'true');
			}
		});
		
		mxEvent.addListener(input, 'keydown', mxUtils.bind(this, function(evt)
		{
			if (evt.keyCode == 13 /* Enter */)
			{
				find();
			}
		}));
		
		mxEvent.addListener(input, 'keyup', mxUtils.bind(this, function(evt)
		{
			modified = true;
			
			if (input.value == '' || (!modified && input.value == searchResource))
			{
				button.setAttribute('disabled', 'true');
			}
			else if (input.value != searchTerm)
			{
				button.removeAttribute('disabled');
				button.innerHTML = searchResource;
			}
			else if (!active)
			{
				if (complete)
				{
					button.setAttribute('disabled', 'true');
					button.innerHTML = mxResources.get('noMoreResults');
				}
				else
				{
					button.removeAttribute('disabled');
					button.innerHTML = mxResources.get('moreResults');
				}
			}
		}));
		
		mxEvent.addListener(input, 'focus', mxUtils.bind(this, function(evt)
		{
			if (input.value == searchResource && !modified)
			{
				input.value = '';
			}
		}));
		
		mxEvent.addListener(input, 'blur', mxUtils.bind(this, function(evt)
		{
			if (input.value == '')
			{
				input.value = searchResource;
				modified = false;
			}
		}));
	    
	    // Workaround for blocked text selection in Editor
	    mxEvent.addListener(input, 'mousedown', function(evt)
	    {
	    	if (evt.stopPropagation)
	    	{
	    		evt.stopPropagation();
	    	}
	    	
	    	evt.cancelBubble = true;
	    });
	    
	    // Workaround for blocked text selection in Editor
	    mxEvent.addListener(input, 'selectstart', function(evt)
	    {
	    	if (evt.stopPropagation)
	    	{
	    		evt.stopPropagation();
	    	}
	    	
	    	evt.cancelBubble = true;
	    });
	    
		this.addFoldingHandler(elt, div, function()
		{
			// not lazy
		}, false);
	    
		var outer = document.createElement('div');
	    outer.appendChild(div);
	    this.container.appendChild(outer);
		
	    // Keeps references to the DOM nodes
    	this.palettes['images'] = [elt, outer];
 	};
 	
	// Adds BPMN shapes
	var sidebarAddBpmnPalette = Sidebar.prototype.addBpmnPalette;
	
	Sidebar.prototype.addBpmnPalette = function(dir, expand)
	{
		sidebarAddBpmnPalette.apply(this, arguments);

		var w = 50;
		var h = 50;

		this.addPalette('bpmnGateways', 'BPMN Gateways', false, mxUtils.bind(this, function(content)
		{
			var s = 'shape=mxgraph.bpmn.shape;verticalLabelPosition=bottom;verticalAlign=top;perimeter=rhombusPerimeter;background=gateway;';
			
			content.appendChild(this.createVertexTemplate(s + 'outline=none;symbol=exclusiveGw;', w, h, '', 'Exclusive Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=none;symbol=parallelGw;', w, h, '', 'Parallel Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=general;', w, h, '', 'Inclusive Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=none;symbol=complexGw;', w, h, '', 'Complex Gateway', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=standard;symbol=general;', w, h, '', 'General Start Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=throwing;symbol=general;', w, h, '', 'General Intermediate Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=general;', w, h, '', 'General End Gateway', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=standard;symbol=message;', w, h, '', 'Message Standard Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=message;', w, h, '', 'Message Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventNonint;symbol=message;', w, h, '', 'Message Non-Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=catching;symbol=message;', w, h, '', 'Message Catching Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=message;', w, h, '', 'Message Boundary Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundNonint;symbol=message;', w, h, '', 'Message Boundary Non-Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=throwing;symbol=message;', w, h, '', 'Message Throwing Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=message;', w, h, '', 'Message End Gateway', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=standard;symbol=timer;', w, h, '', 'Timer Standard Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=timer;', w, h, '', 'Timer Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventNonint;symbol=timer;', w, h, '', 'Timer Non-Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=catching;symbol=timer;', w, h, '', 'Timer Catching Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=timer;', w, h, '', 'Timer Boundary Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundNonint;symbol=timer;', w, h, '', 'Timer Boundary Non-Interrupting Gateway', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=escalation;', w, h, '', 'Escalation Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventNonint;symbol=escalation;', w, h, '', 'Escalation Non-Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=escalation;', w, h, '', 'Escalation Boundary Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundNonint;symbol=escalation;', w, h, '', 'Escalation Boundary Non-Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=throwing;symbol=escalation;', w, h, '', 'Escalation Throwing Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=escalation;', w, h, '', 'Escalation End Gateway', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=standard;symbol=conditional;', w, h, '', 'Conditional Standard Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=conditional;', w, h, '', 'Conditional Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventNonint;symbol=conditional;', w, h, '', 'Conditional Non-Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=catching;symbol=conditional;', w, h, '', 'Conditional Catching Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=conditional;', w, h, '', 'Conditional Boundary Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundNonint;symbol=conditional;', w, h, '', 'Conditional Boundary Non-Interrupting Gateway', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=catching;symbol=link;', w, h, '', 'Link Catching Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=throwing;symbol=link;', w, h, '', 'Link Throwing Gateway', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=error;', w, h, '', 'Error Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=error;', w, h, '', 'Error Boundary Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=error;', w, h, '', 'Error End Gateway', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=cancel;', w, h, '', 'Cancel Boundary Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=cancel;', w, h, '', 'Cancel End Gateway', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=compensation;', w, h, '', 'Compensation Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=compensation;', w, h, '', 'Compensation Boundary Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=throwing;symbol=compensation;', w, h, '', 'Compensation Throwing Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=compensation;', w, h, '', 'Compensation End Gateway', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=standard;symbol=signal;', w, h, '', 'Signal Standard Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=signal;', w, h, '', 'Signal Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventNonint;symbol=signal;', w, h, '', 'Signal Non-Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=catching;symbol=signal;', w, h, '', 'Signal Catching Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=signal;', w, h, '', 'Signal Boundary Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundNonint;symbol=signal;', w, h, '', 'Signal Boundary Non-Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=throwing;symbol=signal;', w, h, '', 'Signal Throwing Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=signal;', w, h, '', 'Signal End Gateway', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=standard;symbol=multiple;', w, h, '', 'Multiple Standard Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=multiple;', w, h, '', 'Multiple Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventNonint;symbol=multiple;', w, h, '', 'Multiple Non-Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=catching;symbol=multiple;', w, h, '', 'Multiple Catching Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=multiple;', w, h, '', 'Multiple Boundary Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundNonint;symbol=multiple;', w, h, '', 'Multiple Boundary Non-Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=throwing;symbol=multiple;', w, h, '', 'Multiple Throwing Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=multiple;', w, h, '', 'Multiple End Gateway', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=standard;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Standard Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventNonint;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Non-Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=catching;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Catching Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Boundary Interrupting Gateway', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundNonint;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Boundary Non-Interrupting Gateway', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=terminate;', w, h, '', 'Terminate Gateway', false));
		}));
		
		this.addPalette('bpmnEvents', 'BPMN Events', false, mxUtils.bind(this, function(content)
		{
			var s = 'shape=mxgraph.bpmn.shape;verticalLabelPosition=bottom;verticalAlign=top;perimeter=ellipsePerimeter;';

			content.appendChild(this.createVertexTemplate(s + 'outline=standard;symbol=general;', w, h, '', 'General Start', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=throwing;symbol=general;', w, h, '', 'General Intermediate', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=general;', w, h, '', 'General End', false));
			
			content.appendChild(this.createVertexTemplate(s + 'outline=standard;symbol=message;', w, h, '', 'Message Standard', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=message;', w, h, '', 'Message Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventNonint;symbol=message;', w, h, '', 'Message Non-Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=catching;symbol=message;', w, h, '', 'Message Catching', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=message;', w, h, '', 'Message Boundary Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundNonint;symbol=message;', w, h, '', 'Message Boundary Non-Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=throwing;symbol=message;', w, h, '', 'Message Throwing', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=message;', w, h, '', 'Message End', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=standard;symbol=timer;', w, h, '', 'Timer Standard', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=timer;', w, h, '', 'Timer Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventNonint;symbol=timer;', w, h, '', 'Timer Non-Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=catching;symbol=timer;', w, h, '', 'Timer Catching', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=timer;', w, h, '', 'Timer Boundary Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundNonint;symbol=timer;', w, h, '', 'Timer Boundary Non-Interrupting', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=escalation;', w, h, '', 'Escalation Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventNonint;symbol=escalation;', w, h, '', 'Escalation Non-Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=escalation;', w, h, '', 'Escalation Boundary Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundNonint;symbol=escalation;', w, h, '', 'Escalation Boundary Non-Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=throwing;symbol=escalation;', w, h, '', 'Escalation Throwing', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=escalation;', w, h, '', 'Escalation End', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=standard;symbol=conditional;', w, h, '', 'Conditional Standard', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=conditional;', w, h, '', 'Conditional Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventNonint;symbol=conditional;', w, h, '', 'Conditional Non-Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=catching;symbol=conditional;', w, h, '', 'Conditional Catching', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=conditional;', w, h, '', 'Conditional Boundary Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundNonint;symbol=conditional;', w, h, '', 'Conditional Boundary Non-Interrupting', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=catching;symbol=link;', w, h, '', 'Link Catching', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=throwing;symbol=link;', w, h, '', 'Link Throwing', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=error;', w, h, '', 'Error Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=error;', w, h, '', 'Error Boundary Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=error;', w, h, '', 'Error End', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=cancel;', w, h, '', 'Cancel Boundary Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=cancel;', w, h, '', 'Cancel End', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=compensation;', w, h, '', 'Compensation Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=compensation;', w, h, '', 'Compensation Boundary Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=throwing;symbol=compensation;', w, h, '', 'Compensation Throwing', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=compensation;', w, h, '', 'Compensation End', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=standard;symbol=signal;', w, h, '', 'Signal Standard', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=signal;', w, h, '', 'Signal Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventNonint;symbol=signal;', w, h, '', 'Signal Non-Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=catching;symbol=signal;', w, h, '', 'Signal Catching', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=signal;', w, h, '', 'Signal Boundary Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundNonint;symbol=signal;', w, h, '', 'Signal Boundary Non-Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=throwing;symbol=signal;', w, h, '', 'Signal Throwing', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=signal;', w, h, '', 'Signal End', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=standard;symbol=multiple;', w, h, '', 'Multiple Standard', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=multiple;', w, h, '', 'Multiple Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventNonint;symbol=multiple;', w, h, '', 'Multiple Non-Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=catching;symbol=multiple;', w, h, '', 'Multiple Catching', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=multiple;', w, h, '', 'Multiple Boundary Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundNonint;symbol=multiple;', w, h, '', 'Multiple Boundary Non-Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=throwing;symbol=multiple;', w, h, '', 'Multiple Throwing', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=multiple;', w, h, '', 'Multiple End', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=standard;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Standard', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventInt;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=eventNonint;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Non-Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=catching;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Catching', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundInt;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Boundary Interrupting', false));
			content.appendChild(this.createVertexTemplate(s + 'outline=boundNonint;symbol=parallelMultiple;', w, h, '', 'Parallel Multiple Boundary Non-Interrupting', false));

			content.appendChild(this.createVertexTemplate(s + 'outline=end;symbol=terminate;', w, h, '', 'Terminate', false));
		}));
	};
})();