export default function Links() {
  return (
    <div className="">
      <p>Press [N] to see notes</p> <br />
      <p className="">
        Press [D] to{' '}
        <span className="dark:hidden">
          dim the lights
        </span>
        <span className="hidden dark:inline">
          turn on the lights
        </span>
      </p>

      <p><a>LinkedIn</a>•<a>Email</a>•<a>Github</a>•<a>Apple Music</a></p>
    </div>
  );
}