import React from 'react'
import { Container, Header } from 'semantic-ui-react'

export default class Information extends React.Component {
  render () {
    return (
      <Container textAlign='left' style={{fontSize: 16}}>
        <Header size='large'>
          About Git Trophy
        </Header>
        <p>"Git Trophies" make great desk ornaments, and allow you to proudly display the hard work of you and your teams.</p>

        <Header>
          How do I get my Git Trophy printed?
        </Header>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse id erat varius, venenatis sapien sed, tincidunt libero. Mauris ac finibus risus. Vivamus malesuada auctor leo et congue. Aenean ornare ipsum vel elit iaculis, eu pulvinar libero sagittis. Curabitur sed massa rutrum, egestas nulla ac, varius enim. Duis dapibus felis elit, eget eleifend velit feugiat et. Nam quis aliquet nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>

        <Header>
          What do these look like as printed objects?
        </Header>
        <p>Fusce sodales condimentum lectus vitae sollicitudin. Quisque a sagittis diam, in rhoncus diam. Mauris elementum, turpis eget accumsan placerat, magna dui iaculis odio, eget sollicitudin velit massa id diam. Aenean quis orci non elit iaculis malesuada. Phasellus ut convallis risus. Aenean convallis elit sed turpis venenatis, porttitor dapibus lacus fringilla. Vestibulum sollicitudin feugiat rhoncus. Pellentesque vestibulum lacus purus, eu blandit nisl gravida eget. Praesent volutpat eget quam eu viverra. Suspendisse in orci in diam condimentum vehicula. Nullam orci felis, ullamcorper eget dui in, consectetur imperdiet metus. Curabitur id mauris placerat, rhoncus lectus vitae, mattis nisl. Maecenas at felis viverra, fringilla ligula vel, efficitur odio. Nulla iaculis augue in arcu vestibulum laoreet.</p>

        <Header>
          How expensive are these to print?
        </Header>
        <p>Donec vehicula risus ac porta volutpat. Vestibulum tellus mi, vulputate eget ipsum sed, suscipit convallis ex. Cras vulputate purus nec justo bibendum vestibulum. Integer sed fermentum sem. Integer posuere libero id ipsum rutrum, id commodo metus finibus. Cras congue mollis justo eu vestibulum. Vestibulum vel metus est. Nam non orci mi. Aliquam posuere, enim ac rutrum scelerisque, justo massa dignissim nunc, ultricies rhoncus mauris lorem et metus. Cras porta hendrerit nunc at mattis. In ornare ultrices nunc.</p>

        <Header>
          Doesn't this overemphasize commits as a measure of progress?
        </Header>
        <p>Lighten up! Sure, there may be more accurate measures of the progress of projects, but I just wanted something that would look cool on my desk. 😉</p>

        <Header>
          How did you build this?
        </Header>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse id erat varius, venenatis sapien sed, tincidunt libero. Mauris ac finibus risus. Vivamus malesuada auctor leo et congue. Aenean ornare ipsum vel elit iaculis, eu pulvinar libero sagittis. Curabitur sed massa rutrum, egestas nulla ac, varius enim. Duis dapibus felis elit, eget eleifend velit feugiat et. Nam quis aliquet nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>

        <a className="github-button" href="https://github.com/bcongdon/git-trophy" data-show-count="true" aria-label="Star bcongdon/git-trophy on GitHub">Star</a>
      </Container>
    )
  }
}
