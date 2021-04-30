_Title_:

# Reactive Styling

_Description_:

###### My approach to implementing not just themes in React, but also to allowing users to customize any css property of any component they'd like

_Markdown_:

There are many standard ways to add themes to a website, but when your vision is unique, your approach must be as well.

The user story I've fantasized about since I wrote my first style rule looks like this:

> As a user, I can make my own theme.

Choosing between preset viewing experiences is cool, but what's even cooler is being able to look at the components of a website and say _hey..._

-   I don't want all the colors to go from light to dark, but I do want the borders of my comments to be this shade of blue and the backgrounds of the form fields to be this shade of gray.

-   I don't want all the fonts to be larger, but I do want this text to be this size, that text to be that weight, and those words to remain the same size but have more spacing.

-   I don't care about fonts and colors at all, but I'd like to see my photo albums layed out vertically instead of horizontally while on desktop.

This level of flexibility might sound extreme and/or extremely unnessesary, but I became passionate about implementing the feature when designing my personal website. I wanted to be able to meet with experienced designers for styling guidance and not have to go back to the source code to change things. Someone I respect could review my portfolio and say 'I think the font-size should be bigger on the project titles,' or provide any of the feedback described in the bullets above, and in real time we could see the change from the settings UI immediately.

### Without further adieu... here's how you can do it, too :)

#### <Icon />

Let's work backwards and imagine that I'm the image component that's rendered every time a forecast is displayed in a weather app.

My name is _Icon_, but you know I can be a sun or rain icon and not a facebook or twitter icon because I live in _src/components/weather/WeatherIcon.js_. Those social media icons might be instances of a different component by the same name of _Icon_, but my `path` in conjunction with my `name` uniquely identifies me.

The developer decided that my _width_ and _height_ will always be _50px_ and my _opacity_ would always be _80%_, but what qualifies me as one of the `customizableComponents` that share my `path` (i.e. come from the same file) is my _border_ and _background-color_. The values of those css properties depend on `Icon_props["border"]` and `Icon_props["background-color"]`, which are provided to me at runtime when I'm first rendered or rerendered following a theme change.

#### `styleSeed` and `StyleContext`

Fortunately for me, there is a piece of state called `StyleContext` that stores all the styles within the application that can be altered on demand.

`StyleContext` is initialized by calling `createContext(styleSeed)`. The argument `styleSeed` contains definitions for my _border_ and _background-color_ props. And because `StyleContext.Provider` wraps the entire application and passes `useContext(StyleContext)` as a `value`, those css property values in `styleSeed` are accessible to any component in any file, including me (I'm an <Icon />, in case you forgot).

Here's just me in `styleSeed` after a user specified what they would like my border to look like should they select the _userPreference_ theme as the `currentTheme`:

```javascript
{
    name: 'Icon',
    border: {
        default: '1px solid black',
        userPreference: '3px dotted blue',
        minimalTheme: '0px solid black',
        superTheme: '8px solid crimson'
    },
    "background-color": {
        default: 'lightblue',
        userPreference: null,
        minimalTheme: 'transparent',
        superTheme: 'orange'
    },

}
```

And here's me in the same state in the list of `customizableComponents` that come from the my `path`:

```javascript
{
    path: 'src/components/weather/WeatherIcon.js',
    customizableComponents: [
        {
            name: 'Icon',
            border: {
                default: '1px solid black',
                userPreference: '3px dotted blue',
                minimalTheme: '0px solid black',
                superTheme: '8px solid crimson'
            },
            "background-color": {
                default: 'lightblue',
                userPreference: null,
                minimalTheme: 'transparent',
                superTheme: 'orange'
            },
        },
        {
            name: 'Label',
            "padding-right": {
                default: '0.5rem',
                userPreference: '1rem',
                minimalTheme: '0.1rem',
                superTheme: '3rem'
            },
            color: {
                default: 'white',
                userPreference: 'white',
                minimalTheme: 'black',
            },
        }
    ]
}
```

And here's me and my sibling <Label /> in an extremely slimed down demo version of `styleSeed`

```javascript
const styleSeed = [
    {
        path: 'src/components/social/SocialIcon.js',
        customizableComponents: [
            {
                name: 'Icon',
                width: {
                    default: '25px',
                    userPreference: '2rem',
                    minimalTheme: '15px',
                    superTheme: '50px',
                },
                height: {
                    default: '25x',
                    userPreference: '3.5rem',
                    minimalTheme: '15px',
                    superTheme: '50px',
                },
            },
        ],
    },
    {
        path: 'src/components/weather/WeatherIcon.js',
        customizableComponents: [
            {
                name: 'Icon',
                border: {
                    default: '1px solid black',
                    userPreference: '3px dotted blue',
                    minimalTheme: '0px solid black',
                    superTheme: '8px solid crimson',
                },
                'background-color': {
                    default: 'lightblue',
                    userPreference: null,
                    minimalTheme: 'transparent',
                    superTheme: 'orange',
                },
            },
            {
                name: 'Label',
                'padding-right': {
                    default: '0.5rem',
                    userPreference: '1rem',
                    minimalTheme: '0.1rem',
                    superTheme: '3rem',
                },
                color: {
                    default: 'white',
                    userPreference: 'white',
                    minimalTheme: 'black',
                },
            },
        ],
    },
];
```

Onto more...
