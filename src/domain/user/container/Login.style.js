const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'white'
  },
  siteName: {
    fontWeight: 'lighter',
    letterSpacing: '2px',
    fontSize: '12pt',
    textDecoration: 'none',
    color: 'black'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 'thin',
    borderBottomStyle: 'solid',
    borderColor: '#8b9dc3',
    padding: '2vh 4vh'
  },
  content: {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  description: {
    margin: '2vh 0 8vh 0',
    textAlign: 'center',
    fontSize: '20pt',
    fontWeight: 'lighter'
  },
  loginBtn: {
    cursor: 'pointer',
    width: '30vh'
  },
  logoGithub: {
    width: '4vh',
    height: '4vh'
  }
};

export default styles;
