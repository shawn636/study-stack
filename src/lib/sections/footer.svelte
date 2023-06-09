<script lang="ts">
    import Fa from 'svelte-fa';
    import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
</script>

<div class="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
    <div>
        <h4 class="h4 font-bold mb-2">Products</h4>
        <ul>
            <li><a href="/" class="anchor text-token">Product 1</a></li>
            <li><a href="/" class="anchor text-token">Product 2</a></li>
            <li><a href="/" class="anchor text-token">Product 3</a></li>
            <li><a href="/" class="anchor text-token">Product 4</a></li>
        </ul>
    </div>
    <div>
        <h4 class="h4 font-bold mb-2">Resources</h4>
        <ul>
            <li><a href="/" class="anchor text-token">Documentation</a></li>
            <li><a href="/" class="anchor text-token">Tutorials</a></li>
            <li><a href="/" class="anchor text-token">Blog</a></li>
            <li><a href="/" class="anchor text-token">FAQ</a></li>
        </ul>
    </div>
    <div>
        <h4 class="h4 font-bold mb-2">Company</h4>
        <ul>
            <li><a href="/" class="anchor text-token">About Us</a></li>
            <li><a href="/" class="anchor text-token">Contact Us</a></li>
            <li><a href="/" class="anchor text-token">Careers</a></li>
            <li><a href="/" class="anchor text-token">Privacy Policy</a></li>
        </ul>
    </div>
    <div>
        <h4 class="h4 font-bold mb-2">Follow Us</h4>
        <div class="flex items-center space-x-2">
            <a href="/" class="btn btn-icon variant-filled">
                <Fa icon={faFacebook} size="20" />
            </a>
            <a href="/" class="btn btn-icon variant-filled">
                <Fa icon={faTwitter} size="20" />
            </a>
            <a href="/" class="btn btn-icon variant-filled">
                <Fa icon={faInstagram} size="20" />
            </a>
        </div>
    </div>
</div>
