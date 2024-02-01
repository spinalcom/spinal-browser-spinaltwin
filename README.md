# 25.09.23 : 
        - fix insight application to load only the CP of the equiment isolated in the viewer

# 31.07.23 : v1.8.1
        - correct Description/Endpoints component to display all the endpoints linked to a node

# 17.07.23 : v1.8.0
        - Improve loading on Data room (spinaltwin description)
        - Add multiple inventories
        - Modify style of space assignation component
        - Correction of command feature

# 03.04.23 : v1.7.0
        - Viewer select => table select feature for multi-models
        - Documentation table => add parent documentation
        - Attributes Table => add parent attribute
        - Add Space Assignation Module to assign spaces to room groups
        - Add Creation of Context / Category / Group on Space Application
        - Css correction
        - Fix bugs on ticket node declaration tab
        - Fix bugs on ticket node selected tab on Description & Ticket Apps (priority, creation date, description, parent attributes, parent doc...)
        - Correct Inventory Tab on Space Application
        

# 31.01.23 : v1.6.0
        - Remove toolbar from Autodesk Forge Viewer component // MASQUER DE LA TOOLBAR FORGE
        - Add a button to expand / reduce the AppSelector component
        - Modification of the disposition of datas in the entire application
        - Add Inventory tab and component on Space center
        - Add Tooltips in Insight center and correction of the existing ones and mapping between FR <> ENG
        - Implementation of Inventory Panel besides the viewer component
        - Correction of the buttons in Insight Center
        - Clean some code
        - Add scroll feature on ticket selected

# 30.12.22 : v1.5.0
        - Add .parcel-cache on reset script in package.json
        - Add sprite feature in Insight center
        - Add switch from ticket center TO data room feature
        - Add a hard fix to switch from insight center TO data room feature
        - this.$destroy() certain components when not used anymore, and switch off Events
        - Modification of the behaviour of the viewer when a room, a floor or the entire building is selected on spatial selector, disable hovering
        - multiple css modifications

# 02.12.22
        - Add a component to make a routage between applications 

# 30.11.22 : v1.4.7
        - Add Insight / Endpoints tab feature on Equipment center
        - Add Area Feature on Space Center
        - Fix routing names (fr/eng) in space center and equipment center
        - Modification "X" => "Retour 3D" / "Back to 3D" of endpoint chart viewer
        - Add "Valeurs courantes" / "Current values"  on Insight / endpoint tabs

# 29.11.22 : v1.4.6
        - Correction Of Endpoint tab
        - Add Insight / Endpoint tabs in space center
        - Modification of the disposition of the button on Insight / Endpoint tabs and insight center
        - Fix glitch on insight center
        - Rename of the google tab from Spinal Twin to SpinalTwin
        - Transparent background color added on insight / endpoint tabs

# 28.11.22 : v1.4.5
        - Add proof of concept of link/routage between ticket center and data room
        - add multiple event when a tab is selected in all the applications, to recall "this.initialize()" to update the datas of the tab

# 25.11.22 : v1.4.4 (hard fix)
        - Patch to display the Alarms on Alarm center
        - Command feature added

# 23.12.22 : v1.4.3
        - Add Floor when the target of a ticket is a room, with isolation button
        - Add a button to expand / reduce the data table and the viewer components
        - Remove padding on insight center table
        - Add target Name on Dashboard curve name
        - comment some console.log()

# 21.11.22 : v1.4.2
        - Language routing
        - css of lang selector

# 18.11.22 : v1.4.1
        - Endpoint tab debug : take into account multiple relations to display all the endpoint linked to an item
        - Add Download feature to Insight / Endpoint Tabs
        - Add Download feature in Insight center
        - Correction of moving step's ticket feature
        - Correction of the breadcrumb when a step has been change by the user into ticket app
        - Redesign of step selection-dropdown of ticket detail tab
        - Redesign of Insight Center => Control endpoint list

# 15.11.22 : v1.4.0
        - Insight / Endpoints tabs redesign
        - Add historization graph feature to Insights / Endpoints tabs
        - Ticket declaration form redesign
        - Change Implementation of changelog document
        - Rename changelog.md to README.md
        - Correction of Insights / Endpoints tab to make them display the right datas on the interface

# 04.11.22 : v1.3.0
        - scrollbar redesign
        - Ticket node redesign
        - Breadcrumb redesign
        - Auto-isolate + synchro with top-spatial-selector on DataRoom while going through the geographicContext table
        - Back button debug
        - remove debounce on isolation in top-spatial-selector
        - add event to remove debounce outside of top-spatial-selector
        - add multiples hovers => selection on dataroom and insight center
        - add saving position feature on note views
        - Ticket node updated debug
        - Changing ticket => ticket node debug
        - readme corrections
        - redesign coloration rectangle css

# 28.10.22 : v.1.2.0
    - Général : 
        - added "spinal-components" and "material-design-icons-iconfont" librairies
        - added "imgurify" to package.json
        - redesign of multiple interfaces (AppList, spatial selector, data room, insight center, ticket center, equipment center, space center)
        - BUG correction of notes and documentation

# 19.10.22 : v1.1.1
    - Ticket App :
        - Correction of isolation, selection, coloration, note list, documentation, attributes, events on ticket node
    - Data App : 
        - Correction of isolation, coloration, selection on all geaographic context's nodes






        

