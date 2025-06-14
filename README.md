# Boxure
A dedicated platform for buying, selling, and trading blind box collectibles containing random figurines or items. Whether you're a casual collector or a serious trader, this platform makes managing your collection seamless and fun.

<h2>Getting Started</h2>

<p>To connect and run SQL commands, use:</p>
<pre><code>docker exec -it boxure-db-1 psql -U postgres -d test_db</code></pre>

<p>Build the Docker containers:</p>
<pre><code>docker compose build</code></pre>

<p>Start the containers:</p>
<pre><code>docker compose up</code></pre>

<p>To remove the current containers:</p>
<pre><code>docker compose down</code></pre>

<h2>Front-end Structure</h2>
<p>Global components go under src/app/components</p>
<p>Page files are their page-specific components are under src/app/'page-name'</p>
<p>Config files such as firebase.js will go under src/config</p>
<p>Global css will go under src/styles<p>


